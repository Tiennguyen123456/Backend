"use client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SpanRequired from "@/components/ui/span-required";
import { phoneRegExp } from "@/constants/variables";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toastSuccess } from "@/utils/toast";

export default function LandingPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** State
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const formSchema = z.object({
        name: z.string().min(1, { message: translation("error.requiredName") }),
        email: z.string().email({ message: translation("error.invalidEmail") }),
        phone: z.string().regex(phoneRegExp, { message: translation("error.invalidPhone") }),
        address: z.string().min(1, { message: translation("error.requiredAddress") }),
    });
    type FormValues = z.infer<typeof formSchema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
        },
    });
    let onSubmit = async (data: FormValues) => {
        setLoading(true);
        toastSuccess("Gửi thông tin thàng công!");
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };
    return (
        <div
            style={{
                background:
                    "url('https://checkin.delfi.vn/storage/uploads/2024/01/16/dltn---dai-ichi---never-enough---invitation---social-01_1705400469.jpg') no-repeat center center",
                backgroundSize: "cover",
            }}
            className="w-full h-full relative"
        >
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-60">
                <Button
                    variant={"outline"}
                    className="animate-bounce text-2xl w-full bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 hover:from-blue-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white uppercase font-bold shadow-md rounded-full mx-auto p-8"
                    onClick={() => setOpen(true)}
                >
                    Đăng ký
                </Button>

                <Dialog
                    open={open}
                    onOpenChange={() => setOpen(!open)}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl text-center">Form Thông Tin</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="grid gap-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-2">
                                            <FormLabel className="text-right">
                                                {translation("label.name")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10 col-span-3"
                                                    disabled={loading}
                                                    placeholder={translation("placeholder.name")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="col-span-1"></div>
                                            <FormMessage className="col-span-3" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-2">
                                            <FormLabel className="text-right">
                                                {translation("label.email")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10 col-span-3"
                                                    disabled={loading}
                                                    placeholder={translation("placeholder.email")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="col-span-1"></div>
                                            <FormMessage className="col-span-3" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-2">
                                            <FormLabel className="text-right">
                                                {translation("label.phone")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10 col-span-3"
                                                    disabled={loading}
                                                    placeholder={translation("placeholder.phone")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="col-span-1"></div>
                                            <FormMessage className="col-span-3" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-2">
                                            <FormLabel className="text-right">
                                                {translation("label.address")}
                                                <SpanRequired />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="h-10 col-span-3"
                                                    disabled={loading}
                                                    placeholder={translation("placeholder.address")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="col-span-1"></div>
                                            <FormMessage className="col-span-3" />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    disabled={loading}
                                    variant="default"
                                    type={"submit"}
                                    className="mt-3"
                                >
                                    {translation("action.submit")}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
