"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

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
import { APIStatus, MessageCode } from "@/constants/enum";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import campaignApi from "@/services/campaign-api";

interface CellActionProps {
    data: CampaignColumn;
    canUpdate?: boolean;
    canDelete?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({ data, canUpdate, canDelete }) => {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    // ** State
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // ** Func
    const onConfirm = async () => {
        try {
            setLoading(true);

            const response = await campaignApi.deleteCampaign(data.id);

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(translation(`successApi.${APIStatus.SUCCESS}`));
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

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
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
                    { canUpdate && (
                        <DropdownMenuItem onClick={() => router.push(ROUTES.CAMPAIGNS + `/${data.id}`)}>
                            <Edit className="mr-3 h-4 w-4" /> {translation("action.edit")}
                        </DropdownMenuItem>
                    )}
                    { canDelete && (
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
