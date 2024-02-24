"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { IModal } from "@/models/Modal";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import SpanRequired from "@/components/ui/span-required";
import { APIStatus, RoleEnable, RoleGuard } from "@/constants/enum";
import { toastError, toastSuccess } from "@/utils/toast";
import { IRoleRes } from "@/models/api/role-api";
import { Switch } from "@/components/ui/switch";
import roleApi from "@/services/role-api";

interface CompanyModalProps extends IModal {
    className?: string;
    defaultData: IRoleRes | null;
    onConfirm: () => void;
}

export const RoleModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, defaultData, className, onConfirm }) => {
    // ** I18n
    const translation = useTranslations("");

    // ** Use State
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = defaultData ? translation("rolesPage.edit.title") : translation("rolesPage.create.title");
    const messageSuccess = defaultData
        ? translation("successApi.UPDATE_ROLE_SUCCESS")
        : translation("successApi.CREATE_ROLE_SUCCESS");
    const messageError = defaultData
        ? translation("errorApi.UPDATE_ROLE_FAILED")
        : translation("errorApi.CREATE_ROLE_FAILED");
    const action = defaultData ? translation("action.save") : translation("action.create");

    // useForm
    const formSchema = z.object({
        id: z.number().optional(),
        name: z.string().min(1, { message: translation("error.requiredRoleName") }),
        guard_name: z.string().default(RoleGuard.API),
        enable: z.number().default(RoleEnable.Active),
    });
    type RoleFormValues = z.infer<typeof formSchema>;
    const resetDataForm: RoleFormValues = {
        name: "",
        guard_name: RoleGuard.API,
        enable: RoleEnable.Active,
    };
    const form = useForm<RoleFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultData || resetDataForm,
    });

    const onSubmit = async (data: RoleFormValues) => {
        try {
            setLoading(true);
            const response = await roleApi.storeRole(data);

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
            }
            onConfirm();
            handleCloseModal();
        } catch (error: any) {
            const data = error?.response?.data;
            if (data.data && data?.message_code) {
                const [value] = Object.values(data.data);
                const message = Array(value).toString() ?? messageError;
                toastError(message);
            } else {
                toastError(messageError);
            }
            console.log("error: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        form.reset();
        onClose();
    };

    useEffect(() => {
        if (defaultData != undefined) {
            form.reset(defaultData);
        } else {
            form.reset({
                ...resetDataForm,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultData]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            className={className}
            title={title}
            description=""
            isOpen={isOpen}
            onClose={handleCloseModal}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full"
                >
                    <div className="grid grid-cols-1 gap-2 md:gap-4 py-1 md:py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {translation("label.name")}
                                        <SpanRequired />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            disabled={loading}
                                            placeholder={translation("placeholder.name")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="guard_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {translation("label.guard")}
                                        <SpanRequired />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            disabled={true}
                                            placeholder={translation("placeholder.guard")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="enable"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-base">{translation("label.enable")}</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value == RoleEnable.Active ? true : false}
                                            onCheckedChange={(event) => {
                                                field.onChange(event ? RoleEnable.Active : RoleEnable.Inactive);
                                            }}
                                            defaultChecked={field.value == RoleEnable.Active ? true : false}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-x-2 flex items-center justify-end w-full mt-2 sm:mt-0">
                        <Button
                            disabled={loading}
                            variant="default"
                            type="submit"
                        >
                            {action}
                        </Button>
                        <Button
                            type="button"
                            disabled={loading}
                            variant="outline"
                            onClick={handleCloseModal}
                        >
                            {translation("action.cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};
