"use client";

import { useViewerToken } from "@/hooks/use-viewer-token";
import { User, Stream } from "@prisma/client";
import { Chat } from "./chat";
import { ChatToggle } from "./chatToggle";
import { Header} from "./header";
import { AboutCard } from "./aboutCard";
import { cn } from "@/lib/utils"
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { LiveKitRoom } from "@livekit/components-react";
import { Video} from "./video";

type CustomStream = {
    id: string;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
    isLive: boolean;
    thumbnailUrl: string | null;
    name: string;
};

type CustomUser = {
    id: string;
    username: string;
    bio: string | null;
    imageUrl: string;
    stream: CustomStream | null;
    _count: { followedBy: number}
};

interface StreamPlayerProps {
    user: CustomUser;
    stream: CustomStream;
    isFollowing: boolean;
}

export const StreamPlayer = ({
    user,
    stream,
    isFollowing,
}: StreamPlayerProps) => {
    const {
        token,
        name,
        identity,
    } = useViewerToken(user.id);
    const { collapsed } = useChatSidebar((state) => state);

    console.log({ token, name, identity })

    if (!token || !name || !identity) {
        return <StreamPlayerSkeleton />
    }

    return (
        <div className="h-full mt-[0px]">
            <LiveKitRoom 
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                className="h-full"
            >
                <div className="h-full relative">
                    {collapsed && (
                        <div className="hidden lg:block absolute top-4 right-0 z-50">
                            <ChatToggle />
                        </div>
                    )}
                    <div className={cn(
                        "transition-all h-full",
                        collapsed ? "pr-[0px]" : "pr-[330px]"
                    )}>
                        <div className="space-y-4">
                            <Video 
                                hostName={user.username}
                                hostIdentity={user.id}
                            />
                            <Header 
                                hostName={user.username}
                                hostIdentity={user.id}
                                viewerIdentity={identity}
                                imageUrl={user.imageUrl}
                                isFollowing={isFollowing}
                                name={stream.name}
                            />
                            <AboutCard 
                                hostName={user.username}
                                hostIdentity={user.id}
                                viewerIdentity={identity}
                                bio={user.bio}
                                followedByCount={user._count.followedBy}
                            />
                        </div>
                    </div>
                    <div className={cn(
                        "transition-all fixed bottom-0 right-0 w-[330px]",
                         collapsed && "hidden"
                    )}>
                        <Chat 
                            viewerName={name}
                            hostName={user.username}
                            hostIdentity={user.id}
                            isFollowing={isFollowing}
                            isChatEnabled={stream.isChatEnabled}
                            isChatDelayed={stream.isChatDelayed}
                            isChatFollowersOnly={stream.isChatFollowersOnly}
                        />
                    </div>
                </div>
            </LiveKitRoom>
        </div>
    );
};

export const StreamPlayerSkeleton = () => {
    return (
        <div className="h-full">
        </div>
    );
};