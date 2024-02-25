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
import { APIStatus, EStatus } from "@/constants/enum";
import { toastError, toastSuccess } from "@/utils/toast";
import { IAccountRes } from "@/models/api/account-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_VALID } from "@/constants/variables";
import { IOption } from "@/models/Select";
import { IRoleRes } from "@/models/api/role-api";
import ApiRoutes from "@/services/api.routes";
import { useFetchDataTable } from "@/data/fetch-data-table";
import { ComboboxSearchCompany } from "./combobox-search-company";
import accountApi from "@/services/account-api";

interface CompanyModalProps extends IModal {
    className?: string;
    defaultData: IAccountRes | null;
    onConfirm: () => void;
}

export const AccountModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, defaultData, className, onConfirm }) => {
    console.log(defaultData);
    // ** I18n
    const translation = useTranslations("");

    // ** Use State
    const [roles, setRoles] = useState<IOption[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = defaultData ? translation("accountPage.edit.title") : translation("accountPage.create.title");
    const messageSuccess = defaultData
        ? translation("successApi.UPDATE_ACCOUNT_SUCCESS")
        : translation("successApi.CREATE_ACCOUNT_SUCCESS");
    const messageError = defaultData
        ? translation("errorApi.UPDATE_ACCOUNT_FAILED")
        : translation("errorApi.CREATE_ACCOUNT_FAILED");
    const action = defaultData ? translation("action.save") : translation("action.create");

    // useForm
    const formSchema = z.object({
        id: z.number().optional(),
        name: z.string().min(1, { message: translation("error.requiredName") }),
        username: z.string().min(4, { message: translation("error.invalidUserName") }),
        email: z
            .string()
            .min(1, { message: translation("error.requiredEmail") })
            .email({ message: translation("error.invalidEmail") }),
        status: z.string(),
        role_id: z.number().min(1, { message: translation("error.requiredRole") }),
        company_id: z.number().min(1, { message: translation("error.requiredCompany") }),
    });
    type AccountFormValues = z.infer<typeof formSchema>;
    const resetDataForm: AccountFormValues = {
        name: "",
        username: "",
        email: "",
        status: EStatus.ACTIVE,
        role_id: -1,
        company_id: -1,
    };
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultData || resetDataForm,
    });

    const onSubmit = async (data: AccountFormValues) => {
        try {
            setLoading(true);
            const response = await accountApi.storeAccout(data);

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
            }
            onConfirm();
            handleCloseModal();
        } catch (error: any) {
            const data = error?.response?.data;
            if (data?.data && data?.message_code) {
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

    // Use fetch data
    // const { data: dataRole } = useFetchDataRole({ pagination: { pageSize: 50 } });
    const { data: dataRole } = useFetchDataTable<IRoleRes>({
        url: ApiRoutes.getRoles,
        params: {
            pagination: { page: 1, limit: 50 },
        },
    });
    useEffect(() => {
        const roles = dataRole.map((role) => ({
            label: role.name,
            value: role.id,
        }));
        setRoles(roles);
    }, [dataRole]);

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
                            name="company_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-base">{translation("label.company")}</FormLabel>
                                    <ComboboxSearchCompany
                                        disabled={loading}
                                        onSelectCompany={field.onChange}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {translation("label.username")}
                                        <SpanRequired />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            disabled={loading}
                                            placeholder={translation("placeholder.username")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-base">
                                        {translation("label.email")}
                                        <SpanRequired />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            disabled={loading}
                                            placeholder={translation("placeholder.email")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.status")}</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-10">
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder={translation("placeholder.status")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {STATUS_VALID.map((status) => (
                                                <SelectItem
                                                    key={status.value}
                                                    value={status.value}
                                                >
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.role")}</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={(event) => {
                                            field.onChange(Number(event));
                                        }}
                                        defaultValue={field.value == -1 ? "" : field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder={translation("placeholder.role")} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roles.map((status) => (
                                                <SelectItem
                                                    key={status.value.toString()}
                                                    value={status.value.toString()}
                                                >
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
