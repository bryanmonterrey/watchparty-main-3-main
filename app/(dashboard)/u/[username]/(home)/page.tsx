import { getUserByUsername } from "@/lib/user-service";
import { currentUser } from "@clerk/nextjs/server";
import { StreamPlayer } from "@/components/stream-player";

interface CreatorPageProps {
    params: {
        username: string;
    };
};

const CreatorPage = async ({
    params,
}: CreatorPageProps) => { 
    const externalUser = await currentUser();
    const user = await getUserByUsername(params.username);

    if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
        throw new Error("Unauthorized");
    }

    return (
        <div className="bg-[#1c1b1e] h-full">
            <StreamPlayer 
            user={user}
            stream={user.stream}
            isFollowing
            />
        </div>
    );
};

export default CreatorPage;