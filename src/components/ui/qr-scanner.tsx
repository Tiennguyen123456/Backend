import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { cn } from "@/lib/utils";
import { FadeLoader } from "react-spinners";
import eventApi from "@/services/event-api";
import { toastError, toastSuccess } from "@/utils/toast";
import { APIStatus, ScanQRCamera } from "@/constants/enum";
import { useTranslations } from "next-intl";
interface QRScannerProps {
    handleLoadingModal: (value: boolean) => void;
    preferredCamera?: string;
}
const QRScanner = ({ handleLoadingModal, preferredCamera = ScanQRCamera.DEFAULT }: QRScannerProps) => {
    // ** I18n
    const translation = useTranslations("");

    const videoElementRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const video: HTMLVideoElement | null = videoElementRef.current;
        if (video) {
            const qrScanner: QrScanner = new QrScanner(
                video,
                async (result) => {
                    try {
                        qrScanner.pause();
                        handleLoadingModal(true);
                        setLoading(true);
                        if (result?.data) {
                            const response = await eventApi.scanQRCode({ code: result.data });
                            if (response.status === APIStatus.SUCCESS) {
                                response.message_code == "SUCCESS"
                                    ? toastSuccess(translation("successApi.SCAN_QR_CODE_SUCCESS"))
                                    : toastSuccess(translation(`successApi.${response.message_code}`));
                            }
                        } else {
                            toastError(translation("errorApi.SCAN_QR_CODE_FAILED"));
                        }
                    } catch (error) {
                        toastError(translation("errorApi.SCAN_QR_CODE_FAILED"));
                        console.log(error);
                    } finally {
                        setTimeout(() => {
                            handleLoadingModal(false);
                            setLoading(false);
                            qrScanner.start();
                        }, 1000);
                    }
                },
                {
                    returnDetailedScanResult: true,
                    highlightScanRegion: true,
                    highlightCodeOutline: false,
                    maxScansPerSecond: 1,
                    preferredCamera: preferredCamera
                },
            );
            qrScanner.start();
            console.log("start camera");
            console.log(qrScanner);
            
            return () => {
                console.log("stop camera");
                qrScanner.stop();
                qrScanner.destroy();
            };
        }
    }, [preferredCamera]);

    return (
        <div>
            <div className="videoWrapper flex justify-center items-center min-h-[200px] sm:min-h-[250px]">
                {loading && <FadeLoader color="#3498db" />}
                <video
                    className={cn("qrVideo", loading ? "hidden" : "")}
                    ref={videoElementRef}
                />
            </div>
        </div>
    );
};

export default QRScanner;
