"use client";

import { useState } from "react";
import { Edit, MoreHorizontal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleColumn } from "./column";
import { useTranslations } from "next-intl";
import { AlertModal } from "@/components/modals/alert-modal";
import roleApi from "@/services/role-api";
import { APIStatus } from "@/constants/enum";
import { toastError, toastSuccess } from "@/utils/toast";

interface CellActionProps {
    data: RoleColumn;
    onRefetch: () => void;
    onRowSelected: () => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onRefetch, onRowSelected }) => {
    // ** I18n
    const translation = useTranslations("");

    // ** State
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // ** Func
    const onConfirm = async () => {
        try {
            setLoading(true);

            const response = await roleApi.deleteRole(data.id);

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(translation("successApi.DELETE_COMPANY_SUCCESS"));
            }
            onRefetch();
        } catch (error: any) {
            const data = error?.response?.data;
            if (data?.message_code) {
                toastError(translation(`errorApi.${data?.message_code}`));
            } else {
                toastError(translation("errorApi.DELETE_COMPANY_FAILED"));
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
                    <DropdownMenuItem onClick={onRowSelected}>
                        <Edit className="mr-3 h-4 w-4" /> {translation("action.edit")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
