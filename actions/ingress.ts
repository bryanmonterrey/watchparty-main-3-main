"use server";

import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressClient,
  IngressVideoEncodingPreset,
  RoomServiceClient,
  TrackSource,
  type CreateIngressOptions,
  IngressVideoOptions,
  IngressAudioOptions,
} from "livekit-server-sdk";
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);

export const resetIngresses = async (hostIdentity: string) => {
  console.log(`Resetting ingresses for host: ${hostIdentity}`);
  try {
    const ingresses = await ingressClient.listIngress({
      roomName: hostIdentity,
    });

    console.log(`Found ${ingresses.length} ingresses`);

    const rooms = await roomService.listRooms([hostIdentity]);

    console.log(`Found ${rooms.length} rooms`);

    for (const room of rooms) {
      console.log(`Deleting room: ${room.name}`);
      await roomService.deleteRoom(room.name);
    }

    for (const ingress of ingresses) {
      if (ingress.ingressId) {
        console.log(`Deleting ingress: ${ingress.ingressId}`);
        await ingressClient.deleteIngress(ingress.ingressId);
      }
    }

    console.log('Reset completed successfully');
  } catch (error) {
    console.error('Error in resetIngresses:', error);
    throw error;
  }
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createIngress = async (ingressType: IngressInput): Promise<string> => {
  console.log(`Creating ingress of type: ${ingressType}`);

  const MAX_RETRIES = 5;
  const INITIAL_BACKOFF = 1000; // 1 second

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const self = await getSelf();
      console.log(`User: ${self.username}, ID: ${self.id}`);

      await resetIngresses(self.id);

      const options: CreateIngressOptions = {
        name: self.username,
        roomName: self.id,
        participantName: self.username,
        participantIdentity: self.id,
      };

      if (ingressType === IngressInput.WHIP_INPUT) {
        options.enableTranscoding = true;
      } else {
        options.video = new IngressVideoOptions({
          source: TrackSource.CAMERA,
          encodingOptions: {
            case: "preset",
            value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
          },
        });
        options.audio = new IngressAudioOptions({
          source: TrackSource.MICROPHONE,
          encodingOptions: {
            case: "preset",
            value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
          },
        });
      }

      console.log('Ingress options:', JSON.stringify(options, null, 2));

      console.log('Attempting to create ingress...');
      const ingress = await ingressClient.createIngress(ingressType, options);

      if (!ingress || !ingress.ingressId || !ingress.url || !ingress.streamKey) {
        throw new Error("Failed to create ingress: Missing required data");
      }

      console.log('Ingress created successfully');
      console.log('Ingress details:', JSON.stringify(ingress, null, 2));

      console.log('Updating database...');
      await db.stream.update({
        where: { userId: self.id },
        data: {
          ingressId: ingress.ingressId,
          serverUrl: ingress.url,
          streamKey: ingress.streamKey,
        },
      });

      console.log('Database updated successfully');

      revalidatePath(`/u/${self.username}/keys`);
      
      return JSON.stringify({
        ingressId: ingress.ingressId,
        serverUrl: ingress.url,
        streamKey: ingress.streamKey,
      });
    } catch (error: any) {
      console.error('Error in createIngress:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      if (error.response && error.response.status === 429) {
        retries++;
        if (retries >= MAX_RETRIES) {
          console.log('Max retries reached. Giving up.');
          throw new Error('Max retries reached. Please try again later.');
        }
        const backoff = INITIAL_BACKOFF * Math.pow(2, retries);
        console.log(`Rate limited. Retrying in ${backoff}ms...`);
        await wait(backoff);
      } else {
        throw error;
      }
    }
  }

  throw new Error('Failed to create ingress after max retries');
};