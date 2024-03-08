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
import { STATUS_VALID, phoneRegExp } from "@/constants/variables";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APIStatus, EStatus, MessageCode } from "@/constants/enum";
import { toastError, toastSuccess } from "@/utils/toast";
import { IClientRes } from "@/models/api/client-api";
import clientApi from "@/services/client-api";

interface ClientModalProps extends IModal {
    className?: string;
    defaultData: IClientRes | null;
    onConfirm: () => void;
    eventId: number;
    isUpdate?: boolean;
}

export const ClientModal: React.FC<ClientModalProps> = ({
    isOpen,
    onClose,
    defaultData,
    className,
    onConfirm,
    eventId,
    isUpdate = false,
}) => {
    // ** I18n
    const translation = useTranslations("");

    // ** Use State
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = defaultData ? translation("clientsPage.edit.title") : translation("clientsPage.create.title");
    const messageSuccess = defaultData
        ? translation("successApi.UPDATE_CLIENT_SUCCESS")
        : translation("successApi.CREATE_CLIENT_SUCCESS");
    const messageError = defaultData
        ? translation("errorApi.UPDATE_CLIENT_FAILED")
        : translation("errorApi.CREATE_CLIENT_FAILED");
    const action = defaultData ? translation("action.save") : translation("action.create");

    // useForm
    const formSchema = z.object({
        id: z.number().optional(),
        fullname: z.string().min(1, { message: translation("error.requiredName") }),
        email: z.string().email({ message: translation("error.invalidEmail") }),
        phone: z.string().regex(phoneRegExp, { message: translation("error.invalidPhone") }),
        address: z.string(),
        group: z.string(),
        type: z.string(),
        status: z.string(),
    });
    type ClientFormValues = z.infer<typeof formSchema>;
    const resetDataForm: ClientFormValues = {
        fullname: "",
        email: "",
        phone: "",
        address: "",
        group: "",
        type: "",
        status: EStatus.ACTIVE,
    };
    const form = useForm<ClientFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultData || resetDataForm,
    });

    const onSubmit = async (dataClient: ClientFormValues) => {
        try {
            setLoading(true);
            const response = await clientApi.storeClient(eventId, dataClient);

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
            }
            onConfirm();
            handleCloseModal();
        } catch (error: any) {
            const data = error?.response?.data;
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 py-1 md:py-4">
                        <FormField
                            control={form.control}
                            name="fullname"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
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
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {translation("label.phone")}
                                        <SpanRequired />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            disabled={loading}
                                            placeholder={translation("placeholder.phone")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.type")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            disabled={loading || defaultData != null}
                                            placeholder={translation("placeholder.type")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="group"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.group")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            disabled={loading}
                                            placeholder={translation("placeholder.group")}
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
                            name="address"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className="text-base">{translation("label.address")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            disabled={loading}
                                            placeholder={translation("placeholder.address")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-x-2 flex items-center justify-end w-full mt-2 sm:mt-0">
                        {isUpdate && (
                            <Button
                                disabled={loading}
                                variant="default"
                                type="submit"
                            >
                                {action}
                            </Button>
                        )}
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
