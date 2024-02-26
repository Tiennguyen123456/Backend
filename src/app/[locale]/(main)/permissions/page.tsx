"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import FooterContainer from "@/components/layout/footer-container";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { IOption } from "@/models/Select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toastError, toastSuccess } from "@/utils/toast";
import { Label } from "@/components/ui/label";
import { useFetchDataPermission } from "@/data/fetch-permission";
import { useFetchDataRole } from "@/data/fetch-data-role";
import { Loader } from "@/components/ui/loader";
import { Checkbox } from "@/components/ui/checkbox";
import permissionApi from "@/services/permisison-api";
import { useAppSelector } from "@/redux/root/hooks";
import { selectUser } from "@/redux/user/slice";
import { isActionsPermissions } from "@/helpers/funcs";
import { ActionPermissions } from "@/constants/routes";

export default function CompaniesPage() {
    // ** I18n
    const translation = useTranslations("");

    // Permission
    const { userPermissions } = useAppSelector(selectUser);

    // State
    const [roles, setRoles] = useState<IOption[]>([]);
    const [roleId, setRoleId] = useState<number>(0);
    const [groupPermission, setGroupPermission] = useState<any[]>([]);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

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
    const { data: dataRole, loading: roleLoading } = useFetchDataRole({ pagination: { pageSize: 50 } });

    useEffect(() => {
        const roles = dataRole.map((role) => ({
            label: role.name,
            value: role.id,
        }));
        setRoles(roles);
    }, [dataRole]);

    // Use fetch all permission
    const { data: dataPermission, loading, setLoading } = useFetchDataPermission({ pagination: { pageSize: 200 } });

    useEffect(() => {
        setGroupPermission(refactorPermission(dataPermission));
    }, [dataPermission]);

    const handleCheckAllGroup = (index: number, checked: any) => {
        groupPermission[index].permission.map((permission: any) => {
            permission.check = checked;
        });

        setGroupPermission([...groupPermission]);
    };

    const handleCheckPermission = (index: number, permissionId: number) => {
        groupPermission[index].permission.map((permission: any) => {
            if (permission.id === permissionId) {
                permission.check = !permission.check;
            }
        });

        setGroupPermission([...groupPermission]);
    };

    const handleChangeRoleId = (roleId: number) => {
        setRoleId(roleId);

        if (roleId === 0) {
            return;
        }

        setLoading(true);

        // Use fetch permission by role
        permissionApi
            .getPermissionByRoleId(roleId)
            .then(function (response) {
                const permissionIds = response.data.collection.map((permission: any) => permission.id);

                handlePermissionByRoleId(permissionIds);
            })
            .catch(function (error) {
                console.log(error);
                handlePermissionByRoleId([]);
            })
            .finally(function () {
                setLoading(false);
            });
    };

    const handlePermissionByRoleId = (permissionIds: any) => {
        groupPermission.map((group: any) => {
            group.permission.map((permission: any) => {
                if (permissionIds.includes(permission.id)) {
                    permission.check = true;
                } else {
                    permission.check = false;
                }
            });
        });

        setGroupPermission([...groupPermission]);
    };

    const handleUpdatePermission = async () => {
        if (roleId === 0) {
            return toastError(translation("error.requiredRoleForUpdatePermission"));
        }

        const permissionIds = groupPermission.reduce((acc: any, group: any) => {
            group.permission.map((permission: any) => {
                if (permission.check) {
                    acc.push(permission.id);
                }
            });
            return acc;
        }, []);

        setSubmitLoading(true);
        // Post api
        permissionApi
            .assignPermission({
                permission_ids: permissionIds,
                role_id: roleId,
            })
            .then(function (response) {
                if (response.status === "success") {
                    toastSuccess(translation("successApi.UPDATE_PERMISSION_SUCCESS"));
                } else {
                    toastError(translation(`errorApi.${response.message_code}`));
                }
            })
            .catch(function (error) {
                console.log(error);
                toastError(translation("errorApi.UPDATE_PERMISSION_FAILED"));
            })
            .finally(function () {
                setSubmitLoading(false);
            });
    };

    const canAssignPermission = () => {
        return isActionsPermissions(userPermissions, ActionPermissions.ASSIGN_PERMISSION_TO_ROLE);
    };

    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("permissionsPage.title")}</h2>
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
                        <Select onValueChange={(value: string) => handleChangeRoleId(parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder={translation("permissionsPage.selectRoleToViewPermissions")} />
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
                        {canAssignPermission() && (
                            <Button
                                type="submit"
                                onClick={handleUpdatePermission}
                                disabled={submitLoading || roleId === 0}
                                className={roleId === 0 ? "hidden" : ""}
                            >
                                {submitLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    translation("action.update")
                                )}
                            </Button>
                        )}
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
                                    className="cursor-pointer font-bold text-lg text-blue-600"
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
