"use client";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SpanRequired from "@/components/ui/span-required";
import { DateTimeFormatServer, EVENT_STATUS } from "@/constants/variables";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Save, Trash, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export default function CreateLandingPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** User Selector
    const { userProfile } = useAppSelector(selectUser);

    // ** Router
    const router = useRouter();

    const BgImgRef = useRef<HTMLInputElement>(null);
    // ** Use State
    const [loading, setLoading] = useState(false);
    const [fieldBasic, setFieldBasic] = useState<ITagsList[]>([]);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const [bgImg, setBgImg] = useState<string>();

    // useForm
    const formSchema = z.object({
        name: z.string().min(1, { message: translation("error.requiredName") }),
        slug: z.string().min(1, { message: translation("error.requiredName") }),
        title: z.string().min(1, { message: translation("error.requiredName") }),
        subtitle: z.string().min(1, { message: translation("error.requiredName") }),
        status: z.string(),
        content: z.string(),
        background_img: z.any().superRefine((val, ctx) => {
            if (!val) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Please select background images.`,
                });
            } else {
                if (!(val instanceof File)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Expected a file.`,
                    });
                }
                if (!ACCEPTED_IMAGE_TYPES.includes(val.type)) {
                    console.log("error file");
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Only these types are allowed .jpg, .jpeg, .png`,
                    });
                }
            }
        }),
        // .refine(
        //     (files) => {
        //         if (!files) return false;
        //         return Array.from(files).every((file) => file instanceof File);
        //     },
        //     { message: "Expected a file" },
        // )
        // .refine(
        //     (files) => Array.from(files).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        //     "Only these types are allowed .jpg, .jpeg, .png and .webp",
        // ),
        // .refine(
        //     (files) => {
        //         if (!files) return false;
        //         return Array.from(files).every((file) => file instanceof File);
        //     },
        //     { message: "Please select background images." },
        // )
        // .refine(
        //     (files) => {
        //         if (!files) return false;
        //         console.log(Array.from(files));
        //         return false;
        //         // return false;
        //     },
        //     { message: "Only these types are allowed .jpg, .jpeg, .png" },
        // ),
    });
    type EventFormValues = z.infer<typeof formSchema>;
    const form = useForm<EventFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            title: "",
            subtitle: "",
            content: "",
            status: EStatus.ACTIVE,
            background_img: "",
        },
    });

    // ** Func
    const onSubmit = async (data: EventFormValues) => {
        const messageSuccess = translation("successApi.CREATE_EVENT_SUCCESS");
        const messageError = translation("errorApi.CREATE_EVENT_FAILED");
        try {
            setLoading(true);
            console.log(data);
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
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
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                {translation("label.slug")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10"
                                                    disabled={true}
                                                    placeholder={translation("placeholder.slug")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                <FormField
                                    control={form.control}
                                    name="background_img"
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel>Picture</FormLabel>
                                            <FormControl>
                                                {bgImg ? (
                                                    <div className="w-full relative">
                                                        <AspectRatio ratio={2 / 1}>
                                                            <Image
                                                                src={bgImg}
                                                                alt="Image"
                                                                layout="fill"
                                                                className="rounded-md object-cover"
                                                            />
                                                        </AspectRatio>
                                                        <Button
                                                            className="p-3 absolute right-1 bottom-1"
                                                            variant={"destructive"}
                                                            onClick={() => {
                                                                setBgImg("");
                                                                form.setValue("background_img", "");
                                                            }}
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    // <div className="overflow-hidden rounded-md relative h-[200px] w-full">
                                                    //     <Image
                                                    //         src={
                                                    //             "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80"
                                                    //         }
                                                    //         alt={"Background Image"}
                                                    //         layout="fill"
                                                    //         className="h-auto w-auto object-cover transition-all aspect-square"
                                                    //     />
                                                    //     <Button
                                                    //         className="p-3 absolute right-1 bottom-1"
                                                    //         variant={"destructive"}
                                                    //         onClick={() => {
                                                    //             setBgImg("");
                                                    //             form.setValue("background_img", "");
                                                    //         }}
                                                    //     >
                                                    //         <Trash2 className="h-5 w-5" />
                                                    //     </Button>
                                                    // </div>
                                                    <div className="h-[200px]">
                                                        <div
                                                            className="flex h-full w-full items-center justify-center rounded-md border border-dashed"
                                                            onClick={() => BgImgRef.current?.click()}
                                                            // onDrop={(event) => console.log(event)}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="lucide lucide-upload h-4 w-4 text-muted-foreground"
                                                            >
                                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                <polyline points="17 8 12 3 7 8"></polyline>
                                                                <line
                                                                    x1="12"
                                                                    x2="12"
                                                                    y1="3"
                                                                    y2="15"
                                                                ></line>
                                                            </svg>
                                                            <span className="sr-only">Upload</span>
                                                        </div>
                                                        <Input
                                                            className="h-10 hidden"
                                                            {...fieldProps}
                                                            placeholder="Picture"
                                                            type="file"
                                                            accept="image/*"
                                                            ref={BgImgRef}
                                                            onChange={(event) => {
                                                                if (event.target.files) {
                                                                    onChange(event.target.files[0]);
                                                                    setBgImg(
                                                                        URL.createObjectURL(event.target.files[0]),
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Communication emails</FormLabel>
                                        <FormDescription>Receive emails about your account activity.</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={true}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem> */}
                            </div>

                            {/* <Separator className="my-5" />

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
                            </div> */}
                        </div>
                    </div>
                    <FooterContainer />
                </form>
            </Form>
        </>
    );
}
