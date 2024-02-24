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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toastError } from "@/utils/toast";
import { Label } from "@/components/ui/label";
import { useFetchDataPermission } from "@/data/fetch-permission";
import { useFetchDataRole } from "@/data/fetch-data-role";
import { useFetchPermisisonByRoleId } from "@/data/fetch-permission-by-role";
import { Loader } from "@/components/ui/loader";
import { Checkbox } from "@/components/ui/checkbox";

export default function CompaniesPage() {
    // ** I18n
    const translation = useTranslations("");
    // ** Use Router
    const router = useRouter();

    // State
    const [roles, setRoles] = useState<IOption[]>([]);
    const [roleId, setRoleId] = useState<number>(0);
    const [groupPermission, setGroupPermission] = useState<any[]>([]);

    // const [permissions, setPermissions] = useState<IPermissionRes[]>([]);

    const refactorPermission = (collection: any) => {
        return collection.reduce((acc: any, permission: any) => {
            const [groupName, permissionName] = permission.name.split(":");

            const existsGroup = acc.find((group: any) => group.groupName === groupName);

            if (existsGroup) {
                existsGroup.permission.push({
                    id: permission.id,
                    name: permissionName,
                });
            } else {
                acc.push({
                    groupName,
                    permission: [
                        {
                            id: permission.id,
                            name: permissionName,
                        },
                    ],
                });
            }

            return acc;
        }, []);
    };

    // Use fetch data
    const { data: dataRole, loading: roleLoading } = useFetchDataRole();

    useEffect(() => {
        const roles = dataRole.map((role) => ({
            label: role.name,
            value: role.id,
        }));
        setRoles(roles);
    }, [dataRole]);

    // Use fetch all permission
    const { data: dataPermission, loading } = useFetchDataPermission({ pagination: { pageSize: 200 } });

    useEffect(() => {
        setGroupPermission(refactorPermission(dataPermission));
    }, [dataPermission]);

    const handleCheckAllGroup = (index: number, checked: any) => {
        groupPermission[index].permission.map((permission: any) => {
            permission.check = checked;
        });

        setGroupPermission([...groupPermission]);
    };

    const handleCheckPermission = (index: number, permissionid: number) => {
        groupPermission[index].permission.map((permission: any) => {
            if (permission.id === permissionid) {
                permission.check = !permission.check;
            }
        });

        setGroupPermission([...groupPermission]);
    };

    console.log(groupPermission);

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

            <Separator />

            {roleLoading ? (
                <div className="flex justify-center items-center h-96">
                    <Loader />
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <Label className="block py-3">{translation("permissionsPage.label.selectRole")}</Label>
                        <Select onValueChange={(value: string) => setRoleId(parseInt(value))}>
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
                    <div className="flex flex-col justify-end">
                        <Button type="submit">{translation("action.save")}</Button>
                    </div>
                </div>
            )}

            <Separator />

            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <Loader />
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    {groupPermission.map((group: any, groupIndex: number) => (
                        <div key={groupIndex}>
                            <div className="flex items-center space-x-2 py-1 font-normal">
                                <Checkbox
                                    id={`checkAll_${groupIndex}`}
                                    checked={group.permission.every((permission: any) => permission.check)}
                                    onCheckedChange={(checked) => handleCheckAllGroup(groupIndex, checked)}
                                />
                                <Label
                                    htmlFor={`checkAll_${groupIndex}`}
                                    className="cursor-pointer font-normal text-lg text-gray-60"
                                >
                                    {group.groupName}
                                </Label>
                            </div>

                            <ul>
                                {group.permission.map((permission: any, index: number) => (
                                    <li
                                        key={index}
                                        className="flex items-center space-x-2 py-1 font-normal"
                                    >
                                        <Checkbox
                                            id={permission.id}
                                            checked={permission.check}
                                            onCheckedChange={(checked) => {
                                                handleCheckPermission(groupIndex, permission.id);
                                            }}
                                        />
                                        <Label
                                            htmlFor={permission.id}
                                            className="cursor-pointer font-normal"
                                        >
                                            {permission.name}
                                        </Label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            <FooterContainer />
        </>
    );
}
