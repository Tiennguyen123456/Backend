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
import { APIStatus, MessageCode, RoleEnable, RoleGuard } from "@/constants/enum";
import { toastError, toastSuccess } from "@/utils/toast";
import { Textarea } from "@/components/ui/textarea";
import { ICustomFields } from "@/models/api/event-api";
import eventApi from "@/services/event-api";

interface CustomFieldProps extends IModal {
    eventId: number;
    className?: string;
    defaultData: ICustomFields | null;
    onConfirm: () => void;
}

export const CustomFieldModal: React.FC<CustomFieldProps> = ({
    eventId,
    isOpen,
    onClose,
    defaultData,
    className,
    onConfirm,
}) => {
    // ** I18n
    const translation = useTranslations("");

    // ** Use State
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = defaultData
        ? translation("customFieldModal.edit.title")
        : translation("customFieldModal.create.title");
    const messageSuccess = defaultData
        ? translation("successApi.UPDATE_CUSTOM_FIELD_SUCCESS")
        : translation("successApi.CREATE_CUSTOM_FIELD_SUCCESS");
    const messageError = defaultData
        ? translation("errorApi.UPDATE_CUSTOM_FIELD_FAILED")
        : translation("errorApi.CREATE_CUSTOM_FIELD_FAILED");
    const action = defaultData ? translation("action.save") : translation("action.create");

    // useForm
    const formSchema = z.object({
        id: z.number().optional(),
        name: z
            .string()
            .min(5, { message: translation("error.requiredCustomFieldName") })
            .refine((value) => /^[a-zA-Z0-9]*$/.test(value), { message: translation("error.invalidCustomFieldName") }),
        description: z.string().optional(),
        value: z.string().min(1, { message: translation("error.requiredCustomFieldValue") }),
    });
    type RoleFormValues = z.infer<typeof formSchema>;
    const resetDataForm: RoleFormValues = {
        name: "",
        description: "",
        value: "",
    };
    const form = useForm<RoleFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultData || resetDataForm,
    });

    const onSubmit = async (data: RoleFormValues) => {
        try {
            setLoading(true);
            const response = await eventApi.updateCustomFieldsEvent(eventId, {
                ...data,
                name: data.name.toUpperCase(),
            });
            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
                onConfirm();
                handleCloseModal();
            }
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
                    <div className="grid grid-cols-1 gap-2 md:gap-4 py-1 md:py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {translation("label.fieldName")}
                                        <SpanRequired />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10 uppercase"
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.description")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10"
                                            disabled={loading}
                                            placeholder={translation("placeholder.description")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-base">
                                        {translation("label.fieldValue")}
                                        <SpanRequired />
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={loading}
                                            {...field}
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
