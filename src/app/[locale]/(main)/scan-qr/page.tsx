"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import QRScannerComponent from "@/components/ui/qr-scanner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SCAN_QR_CODE_CAMERA } from "@/constants/variables";
import { ScanQRCamera } from "@/constants/enum";
import QrScanner from "qr-scanner";

export default function EventsPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** Use State
    const [startScan, setStartScan] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cameraId, setCameraId] = useState<string>(ScanQRCamera.DEFAULT);
    const [listCamera, setListCamera] = useState<QrScanner.Camera[]>(SCAN_QR_CODE_CAMERA);

    const toggleLoading = (value: boolean) => {
        setLoading(value);
    };

    const handleSwitchCamera = (value: string) => {
        setCameraId(value);
    };

    const handleCloseModalScanQR = (value: boolean) => {
        setStartScan(false);
    };

    const handleSetListCamera = (value: QrScanner.Camera[]) => {
        setListCamera([...SCAN_QR_CODE_CAMERA, ...value]);
    };

    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("scanQrPage.title")}</h2>
                </div>
                <div className="flex h-[300px] sm:h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
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
                            {translation("scanQrPage.description")}
                        </p>

                        <Button
                            size="default"
                            className="relative"
                            disabled={loading}
                            onClick={() => {
                                setStartScan(true);
                            }}
                        >
                            <Scan className="w-5 h-5 md:mr-2" />
                            <p className="ml-1">{translation("action.scanQr")}</p>
                        </Button>
                        <Dialog
                            open={startScan}
                            onOpenChange={handleCloseModalScanQR}
                        >
                            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center">
                                        <Select
                                            disabled={loading}
                                            defaultValue={ScanQRCamera.DEFAULT}
                                            onValueChange={handleSwitchCamera}
                                        >
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue defaultValue={"environment"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {listCamera.map((camera, index) => (
                                                    <SelectItem
                                                        value={camera.id}
                                                        key={index}
                                                    >
                                                        {camera.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-2 py-2">
                                    {startScan && (
                                        <QRScannerComponent
                                            handleLoadingModal={toggleLoading}
                                            handleSetListCamera={handleSetListCamera}
                                            cameraId={cameraId}
                                        />
                                    )}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            disabled={loading}
                                        >
                                            {translation("action.stopScan")}
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
