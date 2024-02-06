import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

export const LoginForm = () => {
    // ** I18n
    const translation = useTranslations();

    // useState
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // useForm
    const formSchema = z.object({
        email: z
            .string()
            .min(1, { message: translation("error.requiredEmail") })
            .email({ message: translation("error.invalidEmail") }),
        password: z.string().min(8, { message: translation("error.invalidPassword") }),
        rememberMe: z.boolean(),
    });

    type LoginFormValues = z.infer<typeof formSchema>;

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    // Func
    const onSubmit = async (data: LoginFormValues) => {
        toast.success("Login Success!");
        console.log(data);
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                            <p>{translation("loginPage.description")}</p>
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
                                                    placeholder="example@emaple.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">{translation("label.password")}</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    disabled={loading}
                                                    placeholder=""
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="rememberMe"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center">
                                            <FormControl>
                                                <Checkbox
                                                    disabled={loading}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    id="rememberMe"
                                                />
                                            </FormControl>
                                            <FormLabel
                                                htmlFor="rememberMe"
                                                className="text-base !m-0 !ml-2"
                                            >
                                                {translation("loginPage.rememberMe")}
                                            </FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full uppercase mt-1"
                                disabled={loading}
                            >
                                {translation("loginPage.title")}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </>
    );
};
