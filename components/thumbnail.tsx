import { UserAvatar } from "@/components/useravatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveBadge } from "@/components/livebadge";
import Image from "next/image";

interface ThumbnailProps {
  src: string | null;
  fallback: string;
  isLive: boolean;
  username: string;
}

export const Thumbnail = ({
  src,
  fallback,
  isLive,
  username,
}: ThumbnailProps) => {
  let content;

  if (!src) {
    content = (
      <div className="bg-bgblack flex flex-col items-center justify-center gap-y-4 h-full w-full transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
        <UserAvatar
          size="lg"
          showBadge
          username={username}
          imageUrl={fallback}
          isLive={isLive}
        />
      </div>
    );
  } else {
    content = (
      <Image
        src={src}
        fill
        alt="thumbnail"
        className="object-cover transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rounded-sm"
      />
    );
  }

  return (
    <div className="group aspect-video relative cursor-pointer bg-lightpurp stream">
      <div className="absolute inset-0 bg-lightpurp opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
      {content}
      {isLive && src && (
                <div className="absolute top-2 left-2 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-100">
                    <LiveBadge />
                </div>
            )}
      <div className="absolute top-0 left-0 w-[11px] h-2.5 -rotate-45 -z-30 bg-lightpurp transform scale-0 group-hover:scale-100 origin-top-left transition-transform duration-100" />
      <div className="absolute bottom-0 right-0 w-2.5 h-[11px] -z-30 rotate-45 bg-lightpurp transform scale-0 group-hover:scale-100 origin-bottom-right transition-transform duration-100" />
    </div>
  );
};

export const ThumbnailSkeleton = () => {
  return (
    <div className="group aspect-video relative rounded-xl cursor-pointer">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
