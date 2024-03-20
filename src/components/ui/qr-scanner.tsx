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
    handleSetListCamera: (value: QrScanner.Camera[]) => void;
    cameraId: string;
}

const QRScanner = ({ handleLoadingModal, handleSetListCamera, cameraId = ScanQRCamera.DEFAULT }: QRScannerProps) => {
    // ** I18n
    const translation = useTranslations("");

    const videoElementRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

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
                    highlightCodeOutline: true,
                    maxScansPerSecond: 1,
                },
            );
            qrScanner.start();
            console.log("start camera");
            QrScanner.hasCamera().then((hasCamera) => !hasCamera && setNotFound(true));

            // get list camera
            console.log(qrScanner);
            QrScanner.listCameras(true).then((listCameras) =>
                handleSetListCamera(listCameras.filter((item) => item.id != "")),
            );

            // set camera
            console.log("cameraId: ", cameraId);
            qrScanner.setCamera(cameraId);

            return () => {
                console.log("stop camera");
                qrScanner.stop();
                qrScanner.destroy();
            };
        }
    }, [cameraId]);

    return (
        <div>
            <div className="videoWrapper flex justify-center items-center min-h-[200px] sm:min-h-[250px]">
                {loading && <FadeLoader color="#3498db" />}
                {notFound && <p className="text-base sm:text-xl">{translation("label.notFoundCamera")}</p>}
                <video
                    className={cn("qrVideo", loading || notFound ? "hidden" : "")}
                    ref={videoElementRef}
                />
            </div>
        </div>
    );
};

export default QRScanner;
