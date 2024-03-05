"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import eventApi from "@/services/event-api";
import { APIStatus, MessageCode } from "@/constants/enum";
import { toastError, toastSuccess } from "@/utils/toast";
import { IEventRes } from "@/models/api/event-api";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface InformationFormProps {
    data: IEventRes | undefined;
    onRefresh: () => void;
}

export default function CustomFieldsForm({ data, onRefresh }: InformationFormProps) {
    const eventId = data?.id;
    // ** I18n
    const translation = useTranslations("");

    // ** Use State
    const [loading, setLoading] = useState(false);

    // useForm
    const fieldSchema = z.object({
        id: z.number().optional(),
        name: z
            .string()
            .min(5, { message: translation("error.requiredCustomFieldName") })
            .refine((value) => /^[a-zA-Z0-9]*$/.test(value), { message: translation("error.invalidCustomFieldName") }),
        description: z.string().optional(),
        value: z.string().min(1, { message: translation("error.requiredCustomFieldValue") }),
    });
    const formSchema = z.object({
        custom_fields: z.array(fieldSchema),
    });
    type CustomFieldsFormValues = z.infer<typeof formSchema>;
    const form = useForm<CustomFieldsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            custom_fields: data?.custom_fields.map((item) => ({
                id: item.id,
                name: item.name ?? "",
                description: item.description ?? "",
                value: item.value ?? "",
            })),
        },
    });
    const { fields, remove, append } = useFieldArray({
        name: "custom_fields",
        control: form.control,
        keyName: "keyRow",
    });
    // ** Func
    const onSubmit = async (value: CustomFieldsFormValues) => {
        const messageSuccess = translation("successApi.UPDATE_CUSTOM_FIELD_SUCCESS");
        const messageError = translation("errorApi.UPDATE_CUSTOM_FIELD_FAILED");
        try {
            setLoading(true);
            const { custom_fields } = value;
            const response = await eventApi.updateCustomFieldsEvent(eventId, custom_fields);
            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
                onRefresh();
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
    const onDelete = async (customFieldId: any) => {
        const messageSuccess = translation("successApi.DELETE_CUSTOM_FIELD_SUCCESS");
        const messageError = translation("errorApi.DELETE_CUSTOM_FIELD_FAILED");
        try {
            setLoading(true);
            const response = await eventApi.deleteCustomFieldsEvent(customFieldId);
            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
                onRefresh();
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
    return (
        <Form {...form}>
            <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="hidden md:grid grid-cols-8 gap-x-6 gap-y-4">
                    <Label className="col-span-2">{translation("label.fieldName")}</Label>
                    <Label className="col-span-2">{translation("label.description")}</Label>
                    <Label className="col-span-3">{translation("label.fieldValue")}</Label>
                    <Label className="col-span-1"></Label>
                </div>
                <Separator className="hidden md:block" />
                {fields.map((field, index) => (
                    <div
                        className="space-y-4"
                        key={field.id}
                    >
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-x-2 md:gap-x-4 gap-y-4">
                            <FormField
                                control={form.control}
                                name={`custom_fields.${index}.name`}
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="md:hidden">{translation("label.fieldName")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                className="h-10 uppercase"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`custom_fields.${index}.description`}
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="md:hidden">{translation("label.description")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                className="h-10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`custom_fields.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="col-span-3">
                                        <FormLabel className="md:hidden">{translation("label.fieldValue")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={loading}
                                                className="min-h-[40px] py-0 col-span-3"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="col-span-1 flex justify-center items-end">
                                <Button
                                    disabled={loading}
                                    variant={"destructive"}
                                    type="button"
                                    onClick={field.id ? () => onDelete(field.id) : () => remove(index)}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                        <Separator />
                    </div>
                ))}
                <div className="flex gap-2 justify-end">
                    {fields.length > 0 && (
                        <Button
                            disabled={loading}
                            type="submit"
                        >
                            {translation("action.update")}
                        </Button>
                    )}
                    <Button
                        disabled={loading}
                        type="button"
                        onClick={() => {
                            append({ name: "", value: "", description: "" });
                        }}
                    >
                        {translation("action.appendField")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
