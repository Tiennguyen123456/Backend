"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function EventsPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    // ** Use State
    const [startScan, setStartScan] = useState(false);
    const [loadingScan, setLoadingScan] = useState(false);
    const [selected, setSelected] = useState("environment");
    const [data, setData] = useState("");

    const handleScan = async (scanData: any) => {
        setLoadingScan(true);
        console.log(`loaded data data`, scanData);
        // if (scanData && scanData !== "") {
        //     console.log(`loaded >>>`, scanData);
        //     setData(scanData);
        //     setStartScan(false);
        //     setLoadingScan(false);
        //     // setPrecScan(scanData);
        // }
    };
    const handleError = (err: any) => {
        console.error(err);
    };

    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("scanQrPage.title")}</h2>
                </div>
                <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
                    <div className="mx-auto flex max-w-[250px] flex-col items-center justify-center text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-qr-code"
                        >
                            <rect
                                width="5"
                                height="5"
                                x="3"
                                y="3"
                                rx="1"
                            />
                            <rect
                                width="5"
                                height="5"
                                x="16"
                                y="3"
                                rx="1"
                            />
                            <rect
                                width="5"
                                height="5"
                                x="3"
                                y="16"
                                rx="1"
                            />
                            <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                            <path d="M21 21v.01" />
                            <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                            <path d="M3 12h.01" />
                            <path d="M12 3h.01" />
                            <path d="M12 16v.01" />
                            <path d="M16 12h1" />
                            <path d="M21 12v.01" />
                            <path d="M12 21v-1" />
                        </svg>

                        <h3 className="mt-4 text-lg font-semibold">QR Code</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            Scan QR codes for clients attending company events
                        </p>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="default"
                                    className="relative"
                                    onClick={() => {
                                        setStartScan(true);
                                    }}
                                >
                                    <Scan className="w-5 h-5 md:mr-2" />
                                    <p className="ml-1">{translation("action.scanQr")}</p>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Scan QR</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Scanner
                                            enabled={startScan}
                                            onResult={(text, result) => console.log(text, result)}
                                            onError={(error) => console.log(error?.message)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => {
                                                setStartScan(false);
                                            }}
                                        >
                                            Stop Scan
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <FooterContainer />
        </>
    );
}
