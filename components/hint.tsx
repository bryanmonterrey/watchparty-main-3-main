import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    TooltipArrow
} from "@/components/ui/tooltip";

interface HintProps {
    label: string;
    children: React.ReactNode;
    asChild: boolean;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
};

export const Hint = ({
    label,
    children,
    asChild,
    side,
    align,
}: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild={asChild}>
                    {children}
                </TooltipTrigger>
                    <TooltipContent
                        className="text-black border-none bg-white px-2 py-1 "
                        side={side}
                        align={align}
                    >
                        <p className="font-semibold">
                            {label}
                        </p>
                    <TooltipArrow className="fill-white" width={9} height={5} />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}