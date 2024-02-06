"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellIcon, BellRing, Check, EyeIcon, PersonStandingIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

const notifications = [
    {
        title: "Your call has been confirmed.",
        description: "1 hour ago",
    },
    {
        title: "You have a new message!",
        description: "1 hour ago",
    },
    {
        title: "Your subscription is expiring soon!",
        description: "2 hours ago",
    },
    {
        title: "Your call has been confirmed.",
        description: "1 hour ago",
    },
    {
        title: "You have a new message!",
        description: "1 hour ago",
    },
    {
        title: "Your subscription is expiring soon!",
        description: "2 hours ago",
    },
];

export default function NotificationNav() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                disabled
            >
                <div className="relative flex items-center gap-2 cursor-pointer opacity-75">
                    <Bell className="w-6 h-6" />
                    <span className="absolute -top-3 -right-2 rounded-full w-5 h-5 flex justify-center items-center text-[10px] bg-red-600 text-white">
                        99+
                    </span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-96"
                align="end"
                forceMount
            >
                {/* <CardHeader className="pb-3 px-4 py-3">
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose what you want to be notified about.</CardDescription>
                </CardHeader>
                <DropdownMenuSeparator />
                <CardContent className="grid gap-1 px-4 py-2 overflow-y-auto h-[320px]">
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md p-2 transition-all bg-accent">
                        <BellIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Everything</p>
                            <p className="text-sm text-muted-foreground">Email digest, mentions & all activity.</p>
                        </div>
                    </div>
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md hover:bg-accent hover:text-accent-foreground p-2 text-accent-foreground transition-all">
                        <PersonStandingIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Available</p>
                            <p className="text-sm text-muted-foreground">Only mentions and comments.</p>
                        </div>
                    </div>
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="h-14 -mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                </CardContent> */}

                <CardHeader className="px-4 pt-4 pb-5">
                    <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 overflow-y-auto h-[320px]">
                    <div>
                        {notifications.map((notification, index) => (
                            <div
                                key={index}
                                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                            >
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{notification.title}</p>
                                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="px-4 py-3">
                    <Button className="w-full">
                        <Check className="mr-2 h-4 w-4" /> See all
                    </Button>
                </CardFooter>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
