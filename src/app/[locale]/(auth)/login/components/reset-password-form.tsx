"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/utils/toast";
import { Loader2 } from "lucide-react";
import authApi from "@/services/auth-api";
import { APIStatus } from "@/constants/enum";

interface ResetPasswordFormProps {
    onChangeForm: any;
}

export default function ResetPasswordForm(props: ResetPasswordFormProps) {
    const { onChangeForm } = props;

    // ** I18n
    const translation = useTranslations();

    // ** Router
    const router = useRouter();

    // useState
    const [loading, setLoading] = useState(false);

    // useForm
    const formSchema = z.object({
        email: z
            .string()
            .min(1, { message: translation("error.requiredEmail") })
            .email({ message: translation("error.invalidEmail") })
    });

    type LoginFormValues = z.infer<typeof formSchema>;

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
    });

    // Func
    const onSubmit = async (data: LoginFormValues) => {
        try {
            setLoading(true);

            const response = await authApi.resetPassword({
                email: data.email
            });

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(translation("loginPage.checkYourEmail"));
            }
        } catch (error: any) {
            const data = error?.response?.data;
            if (data?.message_code) {
                toastError(translation(`errorApi.${data?.message_code}`));
            } else {
                toastError(translation("errorApi.LOGIN_FAILED"));
            }
            console.log("error: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full"
            >
                <Card>
                    <CardHeader className="space-y-1 text-center px-6 pt-6 pb-4">
                        <div className="flex justify-center mb-3">
                            <Image
                                width={150}
                                height={100}
                                className="object-cover"
                                alt="Image"
                                src={require("@/assets/images/Delfi_Logo.png")}
                            />
                        </div>
                        <p>{translation("loginPage.descriptionResetPassword")}</p>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{translation("label.email")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder={translation("placeholder.email")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid text-right">
                            <p
                                onClick={() => onChangeForm()}
                                className="cursor-pointer hover:text-blue-700 hover:underline"
                            >
                                {translation("loginPage.goToLogin")}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full uppercase mt-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                translation("button.submit")
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
