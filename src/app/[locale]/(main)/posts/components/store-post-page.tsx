"use client";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SpanRequired from "@/components/ui/span-required";
import { ACCEPTED_IMAGE_TYPES, EVENT_STATUS, specialCharacterRegExp } from "@/constants/variables";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EStatus, PostPageEnable, MessageCode, APIStatus } from "@/constants/enum";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toastError, toastSuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { selectUser } from "@/redux/user/slice";
import { useAppSelector } from "@/redux/root/hooks";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import slugtify from "slugify";
import { IPostRes } from "@/models/api/post-api";
import { Textarea } from "@/components/ui/textarea";
import { ComboboxSearchCompany } from "../../accounts/components/combobox-search-company";
import { ComboboxSearchEvent } from "../../accounts/components/combobox-search-event";
import postApi from "@/services/post-api";

interface StorePostPageComponentProps {
    defaultData: IPostRes | undefined;
}
export default function StorePostPageComponent({ defaultData }: StorePostPageComponentProps) {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    // ** User Selector
    const { userProfile } = useAppSelector(selectUser);

    // ** Use State
    const BgImgRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [bgImg, setBgImg] = useState<string>(defaultData?.background_img ?? "");
    const [formInput, setFormInput] = useState<string[]>(
        defaultData?.form_input ?? ["name", "email", "phone", "address"],
    );
    const [eventReset, setEventReset] = useState({ id: null, label: null });
    const [companyId, setCompanyId] = useState<Number>(-1);

    const titlePage = defaultData ? translation("postPage.edit.title") : translation("postPage.create.title");
    const messageSuccess = defaultData
        ? translation("successApi.UPDATE_POST_SUCCESS")
        : translation("successApi.CREATE_POST_SUCCESS");
    const messageError = defaultData
        ? translation("errorApi.UPDATE_POST_FAILED")
        : translation("errorApi.CREATE_POST_FAILED");
    const actionButton = defaultData ? translation("action.save") : translation("action.create");

    // useForm
    const formSchema = z.object({
        id: z.number().optional(),
        company_id: z
            .number()
            .min(1, { message: translation("error.requiredCompany") })
            .optional(),
        event_id: z.number().min(1, { message: translation("error.requiredSelectEvent") }),
        name: z.string().min(1, { message: translation("error.requiredNamePost") }),
        slug: z.string(),
        title: z.string().min(1, { message: translation("error.requiredTitlePost") }),
        subtitle: z.string().min(1, { message: translation("error.requiredSubtitlePost") }),
        status: z.string(),
        content: z.string(),
        background_img: defaultData
            ? z
                  .any()
                  .superRefine((val, ctx) => {
                      console.log(val);
                      if (!val) {
                          ctx.addIssue({
                              code: z.ZodIssueCode.custom,
                              message: translation("error.requiredBgImgPost"),
                          });
                      } else {
                          if (!ACCEPTED_IMAGE_TYPES.includes(val.type)) {
                              console.log("error file");
                              ctx.addIssue({
                                  code: z.ZodIssueCode.custom,
                                  message: translation("error.invalidBgImgPost"),
                              });
                          }
                      }
                  })
                  .optional()
                  .or(z.literal(""))
            : z.any().superRefine((val, ctx) => {
                  if (!val) {
                      ctx.addIssue({
                          code: z.ZodIssueCode.custom,
                          message: translation("error.requiredBgImgPost"),
                      });
                  } else {
                      if (!ACCEPTED_IMAGE_TYPES.includes(val.type)) {
                          console.log("error file");
                          ctx.addIssue({
                              code: z.ZodIssueCode.custom,
                              message: translation("error.invalidBgImgPost"),
                          });
                      }
                  }
              }),
        form_enable: z.boolean().default(true),
        form_title: z.string(),
        form_content: z.string(),
        form_input: z.string().array(),
    });
    type PostPageValues = z.infer<typeof formSchema>;
    const resetDataForm: PostPageValues = {
        company_id: userProfile?.is_admin ? -1 : userProfile?.company_id,
        event_id: -1,
        name: "",
        slug: "",
        title: "",
        subtitle: "",
        content: "",
        status: EStatus.ACTIVE,
        background_img: "",
        form_enable: true,
        form_title: "",
        form_content: "",
        form_input: formInput,
    };
    const form = useForm<PostPageValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultData
            ? {
                  id: defaultData?.id,
                  company_id: defaultData?.company_id ?? -1,
                  event_id: defaultData?.event_id ?? -1,
                  name: defaultData?.name ?? "",
                  slug: defaultData?.slug ?? "",
                  title: defaultData?.title ?? "",
                  subtitle: defaultData?.subtitle ?? "",
                  content: defaultData?.content ?? "",
                  status: defaultData?.status ?? "",
                  background_img: "",
                  form_enable: defaultData?.form_enable ? true : false,
                  form_title: defaultData?.form_title ?? "",
                  form_content: defaultData?.form_content ?? "",
                  form_input: defaultData?.form_input ?? formInput,
              }
            : resetDataForm,
    });

    // ** Func
    const onSubmit = async (data: PostPageValues) => {
        try {
            setLoading(true);

            const formData = new FormData();
            Object.entries(data).forEach((entry) => {
                const [key, value] = entry;
                if (key == "form_input" && value instanceof Array) {
                    Array.from(value).forEach((input, index) => {
                        formData.append(`form_input[]`, input);
                    });
                } else {
                    formData.append(key, value);
                }
            });
            console.log(formData);
            return;
            const response = await postApi.storePost(formData);
            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
                router.push(ROUTES.POSTS);
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

    const handleFormInputChange = (key: string) => {
        let formInputChange = form.getValues("form_input");
        let index = formInputChange.indexOf(key);
        if (index !== -1) {
            formInputChange = formInputChange.filter((item) => item !== key);
        } else {
            formInputChange.push(key);
        }
        setFormInput(formInputChange);
        form.setValue("form_input", formInputChange);
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
                            <h2 className="text-3xl font-bold tracking-tight">{titlePage}</h2>
                            <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                                <Button
                                    disabled={loading}
                                    variant={"secondary"}
                                    type="submit"
                                >
                                    <Save className="w-5 h-5 md:mr-2" />
                                    <p className="hidden md:block">{actionButton}</p>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="md:max-w-[976px] mx-auto p-4 md:py-6 md:pb-8 md:px-8 border bg-white shadow-md">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                {translation("label.name")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10"
                                                    {...fieldProps}
                                                    value={value}
                                                    disabled={loading}
                                                    placeholder={translation("placeholder.name")}
                                                    onChange={(event) => {
                                                        let nameInput = event.target.value;
                                                        onChange(nameInput);
                                                        form.setValue(
                                                            "slug",
                                                            `/${slugtify(nameInput, {
                                                                replacement: "-",
                                                                remove: specialCharacterRegExp,
                                                                lower: true,
                                                                strict: false,
                                                                trim: true,
                                                            })}`,
                                                        );
                                                    }}
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
                                            <FormLabel className="text-base">{translation("label.slug")}</FormLabel>
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
                                {isSysAdmin() && (
                                    <FormField
                                        control={form.control}
                                        name="company_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">
                                                    {translation("label.company")}
                                                    <SpanRequired />
                                                </FormLabel>
                                                <ComboboxSearchCompany
                                                    disabled={loading || (defaultData != null && true)}
                                                    onSelectCompany={(id) => {
                                                        setEventReset({ ...eventReset });
                                                        setCompanyId(id);
                                                        form.setValue("event_id", -1);
                                                        field.onChange(id);
                                                    }}
                                                    defaultName={defaultData?.company?.name ?? ""}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormField
                                    control={form.control}
                                    name="event_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                {translation("label.event")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <ComboboxSearchEvent
                                                disabled={loading || (defaultData != null && true)}
                                                onSelect={field.onChange}
                                                dataSelected={
                                                    defaultData?.event
                                                        ? { id: defaultData?.event_id, label: defaultData?.event?.name }
                                                        : eventReset
                                                }
                                                filterCompanyId={isSysAdmin() ? companyId.toString() : ""}
                                            />
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
                                    name="background_img"
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem className="row-span-3">
                                            <FormLabel className="text-base">
                                                {translation("label.backgroundImage")}
                                                <SpanRequired />
                                            </FormLabel>
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
                                                                form.trigger("background_img", { shouldFocus: true });
                                                            }}
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="h-[220px]">
                                                        <div
                                                            className="group flex flex-col gap-1 h-full w-full items-center justify-center rounded-md border border-dashed hover:cursor-pointer"
                                                            onClick={() => BgImgRef.current?.click()}
                                                            onDrop={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                if (event.dataTransfer.files) {
                                                                    let fileUpload = event.dataTransfer.files[0];
                                                                    form.setValue("background_img", fileUpload);
                                                                    form.trigger("background_img", {
                                                                        shouldFocus: true,
                                                                    });

                                                                    if (
                                                                        ACCEPTED_IMAGE_TYPES.includes(fileUpload.type)
                                                                    ) {
                                                                        setBgImg(
                                                                            URL.createObjectURL(
                                                                                event.dataTransfer.files[0],
                                                                            ),
                                                                        );
                                                                    }
                                                                }
                                                            }}
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
                                                                className="lucide lucide-upload h-6 w-6 text-muted-foreground group-hover:animate-bounce"
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
                                                            <span>{translation("placeholder.backgroundImage")}</span>
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
                                                                    let fileUpload = event.target.files[0];
                                                                    onChange(fileUpload);
                                                                    form.trigger("background_img", {
                                                                        shouldFocus: true,
                                                                    });
                                                                    if (
                                                                        ACCEPTED_IMAGE_TYPES.includes(fileUpload.type)
                                                                    ) {
                                                                        setBgImg(URL.createObjectURL(fileUpload));
                                                                    }
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
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel className="text-base">{translation("label.content")}</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="h-10"
                                                    disabled={loading}
                                                    placeholder={translation("placeholder.content")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="form_enable"
                                    render={({ field }) => (
                                        <FormItem className="flex gap-3 col-span-2">
                                            <FormLabel className="text-base">
                                                {translation("label.formEnable")}
                                            </FormLabel>
                                            <FormControl>
                                                <Switch
                                                    className="!mt-0"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    defaultChecked={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.getValues("form_enable") == true && (
                                    <>
                                        <Separator className="my-1 col-span-2 hidden sm:block" />
                                        <FormField
                                            control={form.control}
                                            name="form_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base">
                                                        {translation("label.formTitle")}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="h-10"
                                                            disabled={loading}
                                                            placeholder={translation("placeholder.formTitle")}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="form_content"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base">
                                                        {translation("label.formDescription")}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="h-10"
                                                            disabled={loading}
                                                            placeholder={translation("placeholder.formDescription")}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    {translation("label.fieldName")}
                                                </FormLabel>
                                                {/* <FormDescription>Receive emails about your account activity.</FormDescription> */}
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={formInput.includes("name")}
                                                    onCheckedChange={(event) => handleFormInputChange("name")}
                                                />
                                            </FormControl>
                                        </FormItem>
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    {translation("label.fieldEmail")}
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={form.getValues("form_input").includes("email")}
                                                    onCheckedChange={(event) => handleFormInputChange("email")}
                                                />
                                            </FormControl>
                                        </FormItem>
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    {translation("label.fieldPhone")}
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={form.getValues("form_input").includes("phone")}
                                                    onCheckedChange={(event) => handleFormInputChange("phone")}
                                                />
                                            </FormControl>
                                        </FormItem>
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    {translation("label.fieldAddress")}
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={form.getValues("form_input").includes("address")}
                                                    onCheckedChange={(event) => handleFormInputChange("address")}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    </>
                                )}
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
