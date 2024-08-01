"use client";

import { useState, useTransition, useRef, ElementRef } from "react";
import { IngressInput } from "livekit-server-sdk";
import { toast } from "sonner";

import { createIngress } from "@/actions/ingress";

import { 
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem, 
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const ConnectModal = () => {
    const closeRef = useRef<ElementRef<"button">>(null);
    const [isPending, startTransition] = useTransition();
    const [ingressType, setIngressType] = useState<string>(IngressInput[IngressInput.RTMP_INPUT]);

    const onSubmit = () => {
        startTransition(() => {
            createIngress(IngressInput[ingressType as keyof typeof IngressInput])
            .then((result) => {
                const ingressData = JSON.parse(result);
                console.log("Ingress created:", ingressData);
                toast.success("Ingress created successfully");
                closeRef?.current?.click();
            })
            .catch((error) => {
                console.error("Error creating ingress:", error);
                if (error.message.includes("Max retries reached")) {
                    toast.error("Too many requests. Please try again later.");
                } else if (error.message.includes("Bad Request")) {
                    toast.error("Failed to create ingress. Please check your configuration and try again.");
                } else {
                    toast.error("An unexpected error occurred. Please try again.");
                }
            });
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="px-2 h-9" variant="primary">
                    Generate Connection
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex text-emerald-400 justify-center">
                        Generate Connection
                    </DialogTitle>
                </DialogHeader>
                <Select
                    disabled={isPending}
                    value={ingressType}
                    onValueChange={setIngressType}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ingress Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={IngressInput[IngressInput.RTMP_INPUT]}>RTMP</SelectItem>
                        <SelectItem value={IngressInput[IngressInput.WHIP_INPUT]}>WHIP</SelectItem>
                    </SelectContent>
                </Select>
                <Alert className="flex flex-col items-center">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning!</AlertTitle>
                    <AlertDescription>
                        This action will reset all current streams using the current connection
                    </AlertDescription>
                </Alert>
                <div className="w-full flex justify-center gap-x-2">
                    <Button 
                        disabled={isPending}
                        variant="primary" 
                        onClick={onSubmit}
                        className="flex justify-between"
                    >
                        Generate 
                    </Button>
                    <DialogClose ref={closeRef} asChild>
                        <Button variant="ghost">
                            Cancel
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}