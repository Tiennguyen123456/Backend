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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { ITagsList } from "@/models/api/event-api";
import { useFetchDataFieldBasic } from "@/data/fetch-data-field-basic";
import { ComboboxSearchCompany } from "../../../../accounts/components/combobox-search-company";

export default function CreateLandingPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** User Selector
    const { userProfile } = useAppSelector(selectUser);

    // ** Router
    const router = useRouter();

    // ** Use State
    const [loading, setLoading] = useState(false);
    const [fieldBasic, setFieldBasic] = useState<ITagsList[]>([]);
    const [componentLoaded, setComponentLoaded] = useState(false);

    // useForm
    const formSchema = z.object({
        title: z.string().min(1, { message: translation("error.requiredName") }),
        subtitle: z.string().min(1, { message: translation("error.requiredName") }),
        status: z.string(),
        content: z.string(),
    });
    type EventFormValues = z.infer<typeof formSchema>;
    const form = useForm<EventFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            subtitle: '',
            content: '',
            status: EStatus.ACTIVE,

        },
    });

    // ** Func
    const onSubmit = async (data: EventFormValues) => {
        const messageSuccess = translation("successApi.CREATE_EVENT_SUCCESS");
        const messageError = translation("errorApi.CREATE_EVENT_FAILED");
        try {
            setLoading(true);

            // let formattedData = {
            //     ...data,
            //     start_time: data.date.start_time,
            //     end_time: data.date.end_time
            // };

            // const response = await eventApi.storeEvent(formattedData);

            // if (response.data.status == APIStatus.SUCCESS) {
            //     toastSuccess(messageSuccess);
            //     router.push(ROUTES.EVENTS);
            // }
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

    const isSysAdmin = () => userProfile?.is_admin == true;

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
                                {translation("landingPage.create.title")}
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
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                {translation("label.title")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10"
                                                    disabled={loading}
                                                    placeholder={translation("placeholder.title")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subtitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                {translation("label.subtitle")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10"
                                                    disabled={loading}
                                                    placeholder={translation("placeholder.subtitle")}
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
                            </div>

                            <Separator className="my-5" />

                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-8 gap-y-6">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                {translation("label.content")}
                                            </FormLabel>
                                            <FormControl>
                                                <HtmlEditor handleEditorChange={field.onChange}/> 
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
