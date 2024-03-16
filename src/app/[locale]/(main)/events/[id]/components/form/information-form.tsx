"use client";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SpanRequired from "@/components/ui/span-required";
import { DateTimeFormatServer, EVENT_STATUS } from "@/constants/variables";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/root/hooks";
import { selectUser } from "@/redux/user/slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import eventApi from "@/services/event-api";
import { APIStatus, MessageCode } from "@/constants/enum";
import { toastError, toastSuccess } from "@/utils/toast";
import { ComboboxSearchCompany } from "@/app/[locale]/(main)/accounts/components/combobox-search-company";
import { IEventRes } from "@/models/api/event-api";
import { ActionPermissions } from "@/constants/routes";
import { isActionsPermissions } from "@/helpers/funcs";
import { HtmlEditor } from "@/components/ui/html-editor";

interface InformationFormProps {
    data: IEventRes | undefined;
    onRefresh: () => void;
}

export default function InformationForm({ data, onRefresh }: InformationFormProps) {
    // ** I18n
    const translation = useTranslations("");

    // ** User Selector
    const { userPermissions } = useAppSelector(selectUser);

    // ** Use State
    const [loading, setLoading] = useState(false);

    // useForm
    const formSchema = z.object({
        id: z.number(),
        name: z.string().min(1, { message: translation("error.requiredName") }),
        code: z
            .string()
            .min(4, { message: translation("error.requiredCodeCompany") })
            .max(20, { message: translation("error.requiredCodeCompany") })
            .refine((value) => /^[a-zA-Z0-9]*$/.test(value), { message: translation("error.invalidCodeCompany") }),
        date: z
            .object({
                start_time: z
                    .string()
                    .datetime({ message: translation("error.requiredStartDate") })
                    .transform((date) => format(date, DateTimeFormatServer)),
                end_time: z
                    .string()
                    .datetime({ message: translation("error.requiredEndDate") })
                    .transform((date) => format(date, DateTimeFormatServer)),
            })
            .refine((data) => new Date(data.start_time) < new Date(data.end_time), {
                path: ["end_time"],
                message: translation("error.compareStartEndDate"),
            }),
        company_id: z.number().min(1, { message: translation("error.requiredCompany") }),
        status: z.string(),
        description: z.string(),
        email_content: z.string(),
        cards_content: z.string(),
        location: z.string(),
    });
    type EventFormValues = z.infer<typeof formSchema>;
    const form = useForm<EventFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id,
            name: data?.name ?? "",
            code: data?.code ?? "",
            date: {
                start_time: data?.start_time ? new Date(data?.start_time).toISOString() : "",
                end_time: data?.end_time ? new Date(data?.end_time).toISOString() : "",
            },
            company_id: data?.company?.id ?? -1,
            status: data?.status ?? "",
            description: data?.description ?? "",
            email_content: data?.email_content ?? "",
            cards_content: data?.cards_content ?? "",
            location: data?.location ?? "",
        },
    });

    // ** Func
    const onSubmit = async (data: EventFormValues) => {
        const messageSuccess = translation("successApi.UPDATE_EVENT_SUCCESS");
        const messageError = translation("errorApi.UPDATE_EVENT_FAILED");
        try {
            setLoading(true);
            const { date, ...rest } = data;
            let formattedData = { ...rest, start_time: date.start_time, end_time: date.end_time };
            const response = await eventApi.storeEvent(formattedData);
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
    const canUpdateEvent = isActionsPermissions(userPermissions, ActionPermissions.UPDATE_EVENT);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-x-6 gap-y-4">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">
                                    {translation("label.eventCode")}
                                    <SpanRequired />
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-10"
                                        disabled={true}
                                        placeholder={translation("placeholder.eventCode")}
                                        {...field}
                                    />
                                </FormControl>
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
                                    {translation("label.eventName")}
                                    <SpanRequired />
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-10"
                                        disabled={loading}
                                        placeholder={translation("placeholder.eventName")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="company_id"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-base">
                                    {translation("label.company")}
                                    <SpanRequired />
                                </FormLabel>
                                <ComboboxSearchCompany
                                    disabled={true}
                                    onSelectCompany={field.onChange}
                                    defaultName={data?.company?.name ?? ""}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date.start_time"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-base">
                                    {translation("label.startDate")}
                                    <SpanRequired />
                                </FormLabel>
                                <FormControl>
                                    <DateTimePicker
                                        disabled={loading}
                                        className="!w-full"
                                        title={"Pick a date from"}
                                        date={field.value ? new Date(field.value) : undefined}
                                        setDate={(date) => field.onChange(date?.toISOString())}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date.end_time"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-base">
                                    {translation("label.endDate")}
                                    <SpanRequired />
                                </FormLabel>
                                <FormControl>
                                    <DateTimePicker
                                        disabled={loading}
                                        className="!w-full"
                                        title={"Pick a date from"}
                                        date={field.value ? new Date(field.value) : undefined}
                                        setDate={(date) => field.onChange(date?.toISOString())}
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
                                <FormLabel className="text-base">
                                    {translation("label.status")}
                                    <SpanRequired />
                                </FormLabel>
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
                                        {EVENT_STATUS.map((status) => (
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
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">{translation("label.description")}</FormLabel>
                                <FormControl>
                                    <Textarea
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
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">{translation("label.location")}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={loading}
                                        placeholder={translation("placeholder.location")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email_content"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <FormLabel className="text-base">{translation("label.emailContent")}</FormLabel>
                                <FormControl>
                                    <HtmlEditor
                                        handleEditorChange={field.onChange}
                                        valueDefault={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cards_content"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <FormLabel className="text-base">{translation("label.cardsContent")}</FormLabel>
                                <FormControl>
                                    <HtmlEditor
                                        handleEditorChange={field.onChange}
                                        valueDefault={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {canUpdateEvent && (
                    <Button
                        disabled={loading}
                        className="ml-auto"
                        type="submit"
                    >
                        {translation("action.update")}
                    </Button>
                )}
            </form>
        </Form>
    );
}
