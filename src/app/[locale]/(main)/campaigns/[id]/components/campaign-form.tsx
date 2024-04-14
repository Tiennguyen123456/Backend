"use client";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SpanRequired from "@/components/ui/span-required";
import { DateTimeFormatServer, STATUS_VALID } from "@/constants/variables";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ComboboxSearchCompany } from "../../../accounts/components/combobox-search-company";
import { APIStatus, EStatus, MessageCode } from "@/constants/enum";
import { Textarea } from "@/components/ui/textarea";
import { toastError, toastSuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { selectUser } from "@/redux/user/slice";
import { useAppSelector } from "@/redux/root/hooks";
import { ComboboxSearchEvent } from "../../../accounts/components/combobox-search-event";
import { Separator } from "@/components/ui/separator";
import { Label } from "@radix-ui/react-label";
import campaignApi from "@/services/campaign-api";
import { Switch } from "@/components/ui/switch";
import { ICampaignRes } from "@/models/api/campaign-api";

interface CampaignFormProps {
    data: ICampaignRes | undefined;
}

export default function CampaignForm({ data }: CampaignFormProps) {
    // ** I18n
    const translation = useTranslations("");

    // ** User Selector
    const { userProfile } = useAppSelector(selectUser);

    // ** Router
    const router = useRouter();

    // ** Use State
    const [loading, setLoading] = useState(false);
    const [isFilterClient, setIsFilterClient] = useState(data?.filter_client ? true : false);

    // STATUS
    const STATUS = STATUS_VALID.filter((status) => status.value === EStatus.NEW);

    // useForm
    const formSchema = z.object({
        id: z.number(),
        name: z.string().min(1, { message: translation("error.requiredName") }),
        company_id: z.number().min(1, { message: translation("error.requiredCompany") }),
        event_id: z.number().min(1, { message: translation("error.requiredSelectEvent") }),
        // run_time: z
        //     .string()
        //     .datetime({ message: translation("error.requiredRunTime") })
        //     .transform((date) => format(date, DateTimeFormatServer))
        //     .refine((value) =>
        //         new Date(value) > new Date()
        //     , { message: translation("error.timeMustAfterNow") }),
        status: z.string(),
        mail_subject: z.string().min(1, { message: translation("error.requiredMailSubject") }),
        filter_client: z
            .object({
                group: z.string(),
            })
            .nullable(),
        description: z.string(),
    });
    type CampaignFormValues = z.infer<typeof formSchema>;
    const form = useForm<CampaignFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id,
            name: data?.name ?? "",
            company_id: data?.company_id ?? -1,
            event_id: data?.event_id ?? -1,
            // run_time: "",
            status: data?.status ?? EStatus.NEW,
            mail_subject: data?.mail_subject ?? "",
            filter_client: {
                group: data?.filter_client?.group ?? "",
            },
            description: data?.description ?? "",
        },
    });

    // ** Func
    const onSubmit = async (data: CampaignFormValues) => {
        const messageSuccess = translation("successApi.UPDATE_CAMPAIGN_SUCCESS");
        const messageError = translation("errorApi.UPDATE_CAMPAIGN_FAILED");
        try {
            setLoading(true);
            let formatData: CampaignFormValues = isFilterClient ? data : { ...data, filter_client: null };
            const response = await campaignApi.storeCampaign(formatData);
            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
                router.push(ROUTES.CAMPAIGNS);
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
                                {translation("campaignPage.edit.title")}
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
                        <div className="md:max-w-[976px] mx-auto p-2 md:py-6 md:pb-8 md:px-8 border bg-white shadow-md">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
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
                                                    disabled={true}
                                                    onSelectCompany={field.onChange}
                                                    defaultName={data?.company?.name ?? ""}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {!isSysAdmin() ? (
                                    ""
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="event_id"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-base">
                                                    {translation("label.event")}
                                                    <SpanRequired />
                                                </FormLabel>
                                                <ComboboxSearchEvent
                                                    disabled={true}
                                                    onSelect={field.onChange}
                                                    dataSelected={
                                                        data?.event
                                                            ? { id: data?.event_id, label: data?.event?.name }
                                                            : { id: null, label: null }
                                                    }
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                {translation("label.campaignName")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10"
                                                    disabled={loading}
                                                    placeholder={translation("placeholder.campaignName")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <FormField
                                    control={form.control}
                                    name="run_time"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-base">
                                                {translation("label.runTime")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <DateTimePicker
                                                    disabled={loading}
                                                    className="!w-full"
                                                    title={translation("label.pickTime")}
                                                    date={field.value ? new Date(field.value) : undefined}
                                                    setDate={(date) => field.onChange(date?.toISOString())}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                            </div>

                            <Separator className="my-5" />

                            <Label className="text-lg">{translation("label.configEmail")}</Label>

                            <Separator className="my-5" />

                            <div className="grid grid-cols-1 gap-x-8 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="mail_subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                {translation("label.mailSubject")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10"
                                                    disabled={loading}
                                                    placeholder={translation("placeholder.mailSubject")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-3">
                                    <FormLabel className="text-base">{translation("label.filterClient")}</FormLabel>
                                    <Switch
                                        checked={isFilterClient}
                                        defaultChecked={isFilterClient}
                                        onCheckedChange={setIsFilterClient}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 w-full md:w-auto p-4 rounded border-2 border-sky-800">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <FormField
                                            control={form.control}
                                            name="filter_client.group"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base">
                                                        {translation("label.group")}
                                                        <SpanRequired />
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="h-10"
                                                            disabled={loading || !isFilterClient}
                                                            placeholder={translation("placeholder.group")}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-5" />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{translation("label.description")}</FormLabel>
                                        <FormControl>
                                            <Textarea
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
                        </div>
                    </div>
                    <FooterContainer />
                </form>
            </Form>
        </>
    );
}
