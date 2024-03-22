"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function LandingPage() {
    const [open, setOpen] = useState<boolean>(false);
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
                            <DialogTitle className="text-center">Form đăng ký</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="name"
                                    className="text-right"
                                >
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    defaultValue="Pedro Duarte"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="username"
                                    className="text-right"
                                >
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    defaultValue="@peduarte"
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
