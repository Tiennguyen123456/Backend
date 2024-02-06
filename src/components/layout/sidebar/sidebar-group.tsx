import { SideBarItemType } from "@/models/SideBar";
import { SideBarItem } from "./sidebar-item";
import sideBarConfig from "@/configs/SideBarConfig";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { SideBarItemCollapse } from "./sidebar-item-collapse";

type Props = {
    item: SideBarItemType;
    collapsed: boolean;
};

export const SideBarGroup: React.FC<Props> = ({ item, collapsed }) => {
    const translation = useTranslations();

    if (!item.group)
        return (
            <SideBarItem
                key={item.key}
                item={item}
            />
        );
    return (
        <>
            <div className={cn("py-0 px-6 mb-2 mt-3 uppercase", sideBarConfig.group.color)}>
                <h4 style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}>
                    {translation(item.group?.name)}
                </h4>
            </div>
            {item.group?.child.map((route) =>
                route?.child ? (
                    <SideBarItemCollapse
                        key={route.key}
                        item={route}
                    />
                ) : (
                    <SideBarItem
                        key={route.key}
                        item={route}
                    />
                ),
            )}
        </>
    );
};
