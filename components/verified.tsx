import Image from "next/image";

export const VerifiedCheck = () => {
    return (
        <div className="p-0.5 flex items-center justify-center">
            <Image src="/check.svg" width={16} height={16} className="h-4 w-4" alt="Verified Check"/>
        </div>
    );
};