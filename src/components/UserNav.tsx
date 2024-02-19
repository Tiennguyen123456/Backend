"use client";

import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ROUTES } from "@/constants/routes";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/redux/root/hooks";
import { selectUser } from "@/redux/user/slice";

export default function UserNav() {
    // ** I18n
    const translation = useTranslations("topbar");

    // ** Router
    const router = useRouter();

    // ** Redux user
    const { userProfile } = useAppSelector(selectUser);

    // ** Function
    const handleLogout = () => {
        Cookies.remove("authorization");
        Cookies.remove("userPermissions");
        router.push(ROUTES.LOGIN);
    };

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
                    <span className="hidden md:block">{userProfile?.name}</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-48"
                align="end"
                forceMount
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-base font-medium leading-none">{userProfile?.username}</p>
                        <p className="text-sm leading-none text-muted-foreground">{userProfile?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="text-base cursor-pointer">
                        {translation("userNav.profile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-base cursor-pointer">
                        {translation("userNav.settings")}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-base cursor-pointer"
                    onClick={handleLogout}
                >
                    {translation("userNav.logout")}
                </DropdownMenuItem>
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
