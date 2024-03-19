import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Loader } from "./loader";
import { cn } from "@/lib/utils";
import { FadeLoader } from "react-spinners";
import eventApi from "@/services/event-api";
import { toastError, toastSuccess } from "@/utils/toast";
import { APIStatus } from "@/constants/enum";
import { useTranslations } from "next-intl";
interface QRScannerProps {
    handleLoadingModal: (value: boolean) => void;
}
const QRScanner = ({ handleLoadingModal }: QRScannerProps) => {
    // ** I18n
    const translation = useTranslations("");

    const videoElementRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const video: HTMLVideoElement | null = videoElementRef.current;
        if (video) {
            const qrScanner = new QrScanner(
                video,
                async (result) => {
                    try {
                        handleLoadingModal(true);
                        setLoading(true);
                        qrScanner.pause();
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
                },
            );
            qrScanner.start();
            console.log("start");

            return () => {
                console.log(qrScanner);
                qrScanner.stop();
                qrScanner.destroy();
            };
        }
    }, []);

    return (
        <div>
            <div className="videoWrapper flex justify-center items-center min-h-[230px] sm:min-h-[260px]">
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
