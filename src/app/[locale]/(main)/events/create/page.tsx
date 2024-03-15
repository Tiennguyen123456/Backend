"use client";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SpanRequired from "@/components/ui/span-required";
import { DateTimeFormatServer, EVENT_STATUS } from "@/constants/variables";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ComboboxSearchCompany } from "../../accounts/components/combobox-search-company";
import { APIStatus, EStatus, MessageCode } from "@/constants/enum";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import eventApi from "@/services/event-api";
import { toastError, toastSuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { selectUser } from "@/redux/user/slice";
import { useAppSelector } from "@/redux/root/hooks";
import { Separator } from "@/components/ui/separator";
import { HtmlEditor } from "@/components/ui/html-editor";

export default function CreateEventPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** User Selector
    const { userProfile } = useAppSelector(selectUser);

    // ** Router
    const router = useRouter();

    // ** Use State
    const [loading, setLoading] = useState(false);

    // useForm
    const formSchema = z.object({
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
            name: "",
            code: "",
            date: {
                start_time: "",
                end_time: "",
            },
            company_id: userProfile?.is_admin ? -1 : userProfile?.id,
            status: EStatus.ACTIVE,
            description: "",
            email_content: "",
            cards_content: "",
            location: "",
        },
    });

    // ** Func
    const onSubmit = async (data: EventFormValues) => {
        const messageSuccess = translation("successApi.CREATE_EVENT_SUCCESS");
        const messageError = translation("errorApi.CREATE_EVENT_FAILED");
        try {
            setLoading(true);
            let formattedData = {};
            if (userProfile?.is_admin) {
                const { date, ...rest } = data;
                formattedData = { ...rest, start_time: date.start_time, end_time: date.end_time };
            } else {
                const { company_id, date, ...rest } = data;
                formattedData = { ...rest, start_time: date.start_time, end_time: date.end_time };
            }
            const response = await eventApi.storeEvent(formattedData);
            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
                router.push(ROUTES.EVENTS);
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

    const isSysAdmin = () => {
        return userProfile?.is_admin == true;
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="h-full flex-1 space-y-5"
                >
                    <div className="w-full space-y-4">
                        <Breadcrumbs />
                        <div className="flex flex-wrap items-center justify-between space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">
                                {translation("createEventPage.title")}
                            </h2>
                            <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                                <Button
                                    disabled={loading}
                                    variant={"secondary"}
                                    type="submit"
                                >
                                    <Save className="w-5 h-5 md:mr-2" />
                                    <p className="hidden md:block">{translation("action.save")}</p>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="md:max-w-[976px] mx-auto p-4 md:py-6 md:pb-8 md:px-8 border bg-white shadow-md">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
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
                                                    disabled={loading}
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
                                {!isSysAdmin() ? (
                                    ""
                                ) : (
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
                                                    disabled={loading}
                                                    onSelectCompany={field.onChange}
                                                    defaultName={""}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
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
                                            <FormLabel className="text-base">
                                                {translation("label.description")}
                                            </FormLabel>
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
                            </div>

                            <Separator className="my-5" />

                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-8 gap-y-6">
                                <FormField
                                    control={form.control}
                                    name="email_content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                {translation("label.emailContent")}
                                            </FormLabel>
                                            <FormControl>
                                                <HtmlEditor handleEditorChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cards_content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                {translation("label.cardsContent")}
                                            </FormLabel>
                                            <FormControl>
                                                <HtmlEditor handleEditorChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <FooterContainer />
                </form>
            </Form>
        </>
    );
}
