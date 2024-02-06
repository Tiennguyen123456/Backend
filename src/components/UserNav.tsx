"use client";

import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BellIcon, EyeIcon, PersonStandingIcon } from "lucide-react";

export default function UserNav() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                    <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt="@shadcn"
                            />
                        </Avatar>
                    </Button>
                    <span className="hidden md:block">sysadmin</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-48"
                align="end"
                forceMount
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-base font-medium leading-none">sysadmin</p>
                        <p className="text-sm leading-none text-muted-foreground">m@example.com</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="text-base cursor-pointer">Profile</DropdownMenuItem>
                    <DropdownMenuItem className="text-base cursor-pointer">Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-base cursor-pointer">Log out</DropdownMenuItem>
            </DropdownMenuContent>
            {/* <DropdownMenuContent
                className="w-80"
                align="end"
                forceMount
            >
                <CardHeader className="pb-3 px-4">
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose what you want to be notified about.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-1 px-4 overflow-y-auto h-[320px]">
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <BellIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Everything</p>
                            <p className="text-sm text-muted-foreground">Email digest, mentions & all activity.</p>
                        </div>
                    </div>
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <BellIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Everything</p>
                            <p className="text-sm text-muted-foreground">Email digest, mentions & all activity.</p>
                        </div>
                    </div>
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <BellIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Everything</p>
                            <p className="text-sm text-muted-foreground">Email digest, mentions & all activity.</p>
                        </div>
                    </div>
                    <div className="-mx-2 flex items-start space-x-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
                        <PersonStandingIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Available</p>
                            <p className="text-sm text-muted-foreground">Only mentions and comments.</p>
                        </div>
                    </div>
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <EyeIcon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Ignoring</p>
                            <p className="text-sm text-muted-foreground">Turn off all notifications.</p>
                        </div>
                    </div>
                </CardContent>
            </DropdownMenuContent> */}
        </DropdownMenu>
    );
}
