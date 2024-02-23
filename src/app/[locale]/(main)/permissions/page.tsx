"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";
import FooterContainer from "@/components/layout/footer-container";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { IOption } from "@/models/Select";
import { IPermissionRes } from "@/models/api/authority-api";
import roleApi from "@/services/role-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toastError } from "@/utils/toast";

export default function CompaniesPage() {
    // ** I18n
    const translation = useTranslations("");
    // ** Use Router
    const router = useRouter();

    // State
    const [roles, setRoles] = useState<IOption[]>([]);
    const [permissions, setPermissions] = useState<IPermissionRes[]>([]);

    // Use fetch data
    // const { data, loading, pageCount } = useFetchDataRole({ pagination: { page, pageSize: limit } });

    // const [loading, setLoading] = useState(false);

    const handleGetListRoles = async () => {
        try {
            const response = await roleApi.getList({});

            const listRole = response.data.collection.map((role) => ({
                label: role.name,
                value: role.id,
            }));

            setRoles(listRole);
        } catch (error: any) {
            console.log("error: ", error);

            const data = error?.response?.data;
            if (data?.message_code) {
                toastError(translation(`errorApi.${data?.message_code}`));
            } else {
                toastError(translation("errorApi.LOGIN_FAILED"));
            }
        }
    };

    useEffect(() => {
        handleGetListRoles();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Form roles
    const onChangeRole = (value: string) => {
        // handleGetListPermission();
    };

    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("permissionsPage.title")}</h2>
                    <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                        <Button variant={"secondary"}>
                            <PlusCircle className="w-5 h-5 md:mr-2" />
                            <p className="hidden md:block">{translation("action.create")}</p>
                        </Button>
                    </div>
                </div>
            </div>
            <hr />

            <div className="grid grid-cols-4 gap-4">
                <Select onValueChange={onChangeRole}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role to display" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem
                                key={role.value}
                                value={role.value.toString()}
                            >
                                {role.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <FooterContainer />
        </>
    );
}
