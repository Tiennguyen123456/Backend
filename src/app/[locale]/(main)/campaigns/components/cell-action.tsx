"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Trash, Play, Pause, StopCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CampaignColumn } from "./column";
import { useTranslations } from "next-intl";
import { AlertModal } from "@/components/modals/alert-modal";
import { toastError, toastSuccess } from "@/utils/toast";
import { APIStatus, EStatus, EStatusAction, MessageCode } from "@/constants/enum";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import campaignApi from "@/services/campaign-api";

interface CellActionProps {
    data: CampaignColumn;
    onRefetch: () => void;
    canUpdate?: boolean;
    canDelete?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({ data, canUpdate, canDelete, onRefetch }) => {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    // ** State
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [action, setAction] = useState("");
    const [openModalAction, setOpenModalAction] = useState(false);
    const [modalActionTitle, setModalActionTitle] = useState("");
    const [modalActionDescription, setModalActionDescription] = useState("");

    const canStart = data.status == EStatus.NEW || data.status == EStatus.PAUSED;

    const canPause = data.status == EStatus.RUNNING;

    const canStop = data.status != EStatus.STOPPED;

    // ** Func
    const onConfirm = async () => {
        try {
            setLoading(true);

            const response = await campaignApi.deleteCampaign(data.id);

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(translation(`successApi.${APIStatus.SUCCESS}`));
                onRefetch();
            }
        } catch (error: any) {
            const data = error?.response?.data;

            const messageError = translation("errorApi.DELETE_CAMPAIGN_FAILED");
            if (data?.data && data?.message_code == MessageCode.VALIDATION_ERROR) {
                const [value] = Object.values(data.data);
                const message = Array(value).toString() ?? messageError;
                toastError(message);
            } else if (data?.message_code != MessageCode.VALIDATION_ERROR) {
                toastError(translation(`errorApi.${data?.message_code}`));
            } else {
                toastError(messageError);
            }
            console.log("error: ", error);
        } finally {
            setOpen(false);
            setLoading(false);
        }
    };

    const handleAction = async (type: any) => {
        setOpenModalAction(true);
        setAction(type);

        switch (type) {
            case EStatusAction.START:
                setModalActionTitle(translation("action.start"));
                setModalActionDescription(translation("campaignPage.description.confirmStart"));
                break;
            case EStatusAction.PAUSE:
                setModalActionTitle(translation("action.pause"));
                setModalActionDescription(translation("campaignPage.description.confirmPause"));
                break;
            case EStatusAction.STOP:
                setModalActionTitle(translation("action.stop"));
                setModalActionDescription(translation("campaignPage.description.confirmStop"));
                break;

            default:
                break;
        }
    };

    const onAction = async () => {
        try {
            setLoading(true);
            const response = await campaignApi.handleAction(data.id, { action });

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(translation("successApi.SUCCESS"));
                onRefetch();
            }
        } catch (error: any) {
            console.log(error);
            handleApiError(error);
        } finally {
            setOpenModalAction(false);
            setLoading(false);
        }
    };

    const handleApiError = (error: any) => {
        const { response, code } = error;

        if (code == "ERR_NETWORK") {
            toastError(translation("errorApi.ERR_NETWORK"));
        } else if (response?.data?.message_code == MessageCode.VALIDATION_ERROR) {
            const [value] = Object.values(response.data.data);
            const message = Array(value).toString() ?? translation("errorApi.UNKNOWN_ERROR");
            toastError(message);
        } else {
            toastError(translation("errorApi.UNKNOWN_ERROR"));
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
            />
            <AlertModal
                isOpen={openModalAction}
                onClose={() => setOpenModalAction(false)}
                onConfirm={onAction}
                loading={loading}
                title={modalActionTitle}
                description={modalActionDescription}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-40"
                >
                    {canStart && (
                        <DropdownMenuItem onClick={() => handleAction(EStatusAction.START)}>
                            <Play className="mr-3 h-4 w-4" /> {translation("action.start")}
                        </DropdownMenuItem>
                    )}
                    {canPause && (
                        <DropdownMenuItem onClick={() => handleAction(EStatusAction.PAUSE)}>
                            <Pause className="mr-3 h-4 w-4" /> {translation("action.pause")}
                        </DropdownMenuItem>
                    )}
                    {canStop && (
                        <DropdownMenuItem
                            onClick={() => handleAction(EStatusAction.STOP)}
                            className="text-red-700"
                        >
                            <StopCircle className="mr-3 h-4 w-4" /> {translation("action.stop")}
                        </DropdownMenuItem>
                    )}
                    {canUpdate && canStart && (
                        <DropdownMenuItem onClick={() => router.push(ROUTES.CAMPAIGNS + `/${data.id}`)}>
                            <Edit className="mr-3 h-4 w-4" /> {translation("action.edit")}
                        </DropdownMenuItem>
                    )}
                    {canDelete && canStart && (
                        <DropdownMenuItem
                            onClick={() => setOpen(true)}
                            className="text-red-700"
                        >
                            <Trash className="mr-3 h-4 w-4" /> {translation("action.delete")}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
