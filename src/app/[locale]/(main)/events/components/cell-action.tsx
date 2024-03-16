"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventColumn } from "./column";
import { useTranslations } from "next-intl";
import { AlertModal } from "@/components/modals/alert-modal";
import companyApi from "@/services/company-api";
import { toastError, toastSuccess } from "@/utils/toast";
import { APIStatus, MessageCode } from "@/constants/enum";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/redux/root/hooks";
import { selectUser } from "@/redux/user/slice";

interface CellActionProps {
    data: EventColumn;
    canUpdate?: boolean;
    canAssetClient?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({ data, canUpdate = false, canAssetClient = false }) => {
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

            const response = await companyApi.deleteCompany(data.id);

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(translation("successApi.DELETE_COMPANY_SUCCESS"));
            }
            // onRefetch();
        } catch (error: any) {
            const data = error?.response?.data;
            // if (data?.data && data?.message_code) {
            //     const [value] = Object.values(data.data);
            //     const message = Array(value).toString() ?? translation("errorApi.DELETE_COMPANY_FAILED");
            //     toastError(message);
            // } else {
            //     toastError(translation("errorApi.DELETE_COMPANY_FAILED"));
            // }
            const messageError = translation("errorApi.DELETE_COMPANY_FAILED");
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
                    {
                        canUpdate && (
                            <DropdownMenuItem onClick={() => router.push(ROUTES.EVENTS + `/${data.id}`)}>
                                <Edit className="mr-3 h-4 w-4" /> {translation("action.edit")}
                            </DropdownMenuItem>
                        )
                    }
                    {
                        canAssetClient && (
                            <DropdownMenuItem onClick={() => router.push(ROUTES.EVENTS + `/${data.id}/clients`)}>
                                <Users className="mr-3 h-4 w-4" /> {translation("action.client")}
                            </DropdownMenuItem>
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
