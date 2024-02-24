"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { IModal } from "@/models/Modal";
import { ICompanyRes } from "@/models/api/company-api";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import SpanRequired from "@/components/ui/span-required";
import { phoneRegExp } from "@/constants/variables";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APIStatus } from "@/constants/enum";
import { toastError, toastSuccess } from "@/utils/toast";
import companyApi from "@/services/company-api";

interface CompanyModalProps extends IModal {
    className?: string;
    defaultCompany: ICompanyRes | undefined;
    onConfirm: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
    isOpen,
    onClose,
    defaultCompany,
    className,
    onConfirm,
}) => {
    // ** I18n
    const translation = useTranslations("");

    // ** Use State
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = defaultCompany ? translation("companyPage.edit.title") : translation("companyPage.create.title");
    const messageSuccess = defaultCompany
        ? translation("successApi.UPDATE_COMPANY_SUCCESS")
        : translation("successApi.CREATE_COMPANY_SUCCESS");
    const messageError = defaultCompany
        ? translation("errorApi.UPDATE_COMPANY_FAILED")
        : translation("errorApi.CREATE_COMPANY_FAILED");
    const action = defaultCompany ? translation("action.save") : translation("action.create");

    // useForm
    const formSchema = z.object({
        name: z.string().min(1, { message: translation("error.requiredName") }),
        code: z
            .string()
            .min(4, { message: translation("error.requiredCodeCompany") })
            .max(20, { message: translation("error.requiredCodeCompany") })
            .refine((s) => !s.includes(" "), { message: translation("error.invalidCodeCompany") }),
        tax_code: z.string(),
        contact_email: z
            .string()
            .email({ message: translation("error.invalidEmail") })
            .optional()
            .or(z.literal("")),
        contact_phone: z
            .string()
            .regex(phoneRegExp, { message: translation("error.invalidPhone") })
            .optional()
            .or(z.literal("")),
        website: z.string(),
        address: z.string(),
        status: z.string(),
        limited_users: z.coerce
            .number()
            .min(1, { message: translation("error.invalidLimitUsers") })
            .default(1),
        limited_events: z.coerce
            .number()
            .min(1, { message: translation("error.invalidLimitEvents") })
            .default(1),
        limited_campaigns: z.coerce
            .number()
            .min(1, { message: translation("error.invalidLimitCampaigns") })
            .default(1),
    });
    type CompanyFormValues = z.infer<typeof formSchema>;

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultCompany || {
            name: "",
            code: "",
            tax_code: "",
            contact_email: "",
            contact_phone: "",
            website: "",
            address: "",
            status: "NEW",
            limited_users: 1,
            limited_events: 1,
            limited_campaigns: 1,
        },
    });

    const onSubmit = async (data: CompanyFormValues) => {
        try {
            setLoading(true);

            const response = await companyApi.storeCompany(data);

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(messageSuccess);
            }
            onConfirm();
            form.reset();
            onClose();
        } catch (error: any) {
            const data = error?.response?.data;
            if (data?.message_code) {
                toastError(translation(`errorApi.${data?.message_code}`));
            } else {
                toastError(messageError);
            }
            console.log("error: ", error);
        } finally {
            setLoading(false);
        }
    };

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
            onClose={onClose}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 py-1 md:py-4">
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
                                            disabled={loading}
                                            placeholder={translation('placeholder.name')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {translation("label.companyCode")}
                                        <SpanRequired />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder={translation('placeholder.companyCode')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tax_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.taxCode")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder={translation('placeholder.taxCode')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.website")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder={translation('placeholder.website')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.email")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder={translation('placeholder.email')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact_phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.phone")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder={translation('placeholder.phone')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.address")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder={translation('placeholder.address')}
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
                                            <SelectTrigger className="h-12">
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder={translation('placeholder.status')}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[
                                                { label: "New", value: "NEW" },
                                                { label: "Active", value: "ACTIVE" },
                                                { label: "Inactive", value: "INACTIVE" },
                                            ].map((status) => (
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
                            name="limited_events"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.limitEvent")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={loading}
                                            placeholder={translation('placeholder.limitEvent')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="limited_users"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.limitUser")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={loading}
                                            placeholder={translation('placeholder.limitUser')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="limited_campaigns"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{translation("label.limitCampaign")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={loading}
                                            placeholder={translation('placeholder.limitCampaign')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-x-2 flex items-center justify-end w-full">
                        <Button
                            disabled={loading}
                            variant="default"
                            type="submit"
                        >
                            {action}
                        </Button>
                        <Button
                            disabled={loading}
                            variant="outline"
                            onClick={onClose}
                        >
                            {translation("action.cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};
