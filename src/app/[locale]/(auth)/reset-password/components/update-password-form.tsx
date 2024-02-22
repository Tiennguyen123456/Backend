"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toastError, toastSuccess } from "@/utils/toast";
import { Loader2 } from "lucide-react";
import authApi from "@/services/auth-api";
import { APIStatus } from "@/constants/enum";
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/constants/routes";

export default function ResetPasswordForm() {
    // ** I18n
    const translation = useTranslations();

    // ** Router
    const router = useRouter();

    // useState
    const [loading, setLoading] = useState(false);

    // useForm
    const formSchema = z.object({
        password: z.string().min(8, { message: translation("error.invalidPassword") }),
        password_confirm: z.string().min(8, { message: translation("error.invalidPassword") }),
    }).refine(
        (data) => data.password === data.password_confirm,
        {
            message: translation("resetPassword.passwordNotMatch"),
            path: ["password_confirm"],
        }
    );

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            password_confirm: ""
        },
    });

    const searchParams = useSearchParams()

    const token = searchParams.get('token')

    // Func
    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);

            if (!token) {
                toastError(translation("errorApi.TOKEN_NOT_FOUND"));
                return;
            }

            const response = await authApi.updatePasswordWithToken(
                token,
                {
                    password: data.password
                }
            );

            if (response.data.status == APIStatus.SUCCESS) {
                toastSuccess(translation("successApi.SUCCESS"));
                router.push(ROUTES.LOGIN);
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
                        <p>{translation("resetPassword.description")}</p>
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{translation("resetPassword.newPassword")}</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                disabled={loading}
                                                placeholder={translation("placeholder.password")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password_confirm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{translation("resetPassword.confirmPassword")}</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                disabled={loading}
                                                placeholder={translation("placeholder.password")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full uppercase mt-1 bg-blue-500 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                translation("action.update")
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
