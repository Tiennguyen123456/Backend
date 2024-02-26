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
import { CompanyColumn } from "./column";
import { useTranslations } from "next-intl";
import { AlertModal } from "@/components/modals/alert-modal";
import companyApi from "@/services/company-api";
import { toastError, toastSuccess } from "@/utils/toast";
import { APIStatus } from "@/constants/enum";

interface CellActionProps {
    data: CompanyColumn;
    onRefetch: () => void;
    onRowSelected: () => void;
    isUpdate?: boolean;
    isDelete?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({
    data,
    onRefetch,
    onRowSelected,
    isUpdate = false,
    isDelete = false,
}) => {
    // ** I18n
    const translation = useTranslations("");

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
            onRefetch();
        } catch (error: any) {
            const data = error?.response?.data;
            if (data?.data && data?.message_code) {
                const [value] = Object.values(data.data);
                const message = Array(value).toString() ?? translation("errorApi.DELETE_COMPANY_FAILED");
                toastError(message);
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
                    {isUpdate ? (
                        <DropdownMenuItem onClick={onRowSelected}>
                            <Edit className="mr-3 h-4 w-4" /> {translation("action.edit")}
                        </DropdownMenuItem>
                    ) : (
                        ""
                    )}
                    {isDelete ? (
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            <Trash className="mr-3 h-4 w-4" /> {translation("action.delete")}
                        </DropdownMenuItem>
                    ) : (
                        ""
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
