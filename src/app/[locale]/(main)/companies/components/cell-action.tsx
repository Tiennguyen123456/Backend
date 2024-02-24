"use client";

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanyColumn } from "./column";
import { useTranslations } from "next-intl";
import { AlertModal } from "@/components/modals/alert-modal";
import toast from "react-hot-toast";
import companyApi from "@/services/company-api";

interface CellActionProps {
    data: CompanyColumn;
    onRefetch: () => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onRefetch }) => {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();
    const params = useParams();

    // ** State
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // ** Func
    const onConfirm = async () => {
        try {
            setLoading(true);
            // const response = await companyApi.deleteCompany(data.id);
            onRefetch();
            toast.success("Company deleted.");
        } catch (error) {
            toast.error("Make sure you removed all categories using this billboard first.");
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
                    <DropdownMenuLabel>{translation("datatable.action")}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}>
                        <Edit className="mr-3 h-4 w-4" /> {translation("action.edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-3 h-4 w-4" /> {translation("action.delete")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
