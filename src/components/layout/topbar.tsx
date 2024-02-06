import { ListCollapse } from "lucide-react";
import UserNav from "../UserNav";
import LocaleSwitcherSelect from "../LocaleSwitcherSelect";
import NotificationNav from "../NotificationNav";

export default function TopBar() {
    return (
        <div className="border-b">
            <div className={`flex h-16 items-center px-4 md:px-6`}>
                <ListCollapse className="cursor-pointer w-6 h-6 opacity-75" />
                <div className="ml-auto flex items-center space-x-2 md:space-x-4">
                    <LocaleSwitcherSelect />
                    <NotificationNav />
                    <UserNav />
                </div>
            </div>
        </div>
    );
}
