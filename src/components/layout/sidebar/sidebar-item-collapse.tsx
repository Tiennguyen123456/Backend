import sideBarConfig from "@/configs/SideBarConfig";
import { SideBarItemType } from "@/models/SideBar";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Menu, MenuItem, MenuItemStyles, SubMenu, menuClasses } from "react-pro-sidebar";
import styled from "@emotion/styled";

type Props = {
    item: SideBarItemType;
};

const menuItemStyles: MenuItemStyles = {
    root: {
        color: sideBarConfig.root.color,
        fontSize: sideBarConfig.root.fontSize,
        fontWeight: sideBarConfig.root.fontWeight,
    },
    icon: {
        color: sideBarConfig.icon.color,
        [`&.${menuClasses.disabled}`]: {
            color: sideBarConfig.icon.disabled,
        },
    },
    SubMenuExpandIcon: {
        color: sideBarConfig.SubMenuExpandIcon.color,
    },
    subMenuContent: ({ level }) => ({
        backgroundColor: level === 0 ? sideBarConfig.subMenuContent.backgroundColor : "transparent",
    }),
    button: {
        [`&.${menuClasses.disabled}`]: {
            color: sideBarConfig.button.disabled,
        },
        "&:hover": {
            backgroundColor: sideBarConfig.button.hover.backgroundColor,
            color: sideBarConfig.button.hover.color,
        },
    },
};

export const SideBarItemCollapse: React.FC<Props> = ({ item }) => {
    // ** Router
    const router = useRouter();
    const pathname = usePathname();

    // ** I18n
    const translation = useTranslations();
    const locale = useLocale();

    if (!item.sideBarProps) {
        return null;
    }

    return (
        <Menu menuItemStyles={menuItemStyles}>
            <StyledSubMenu
                label={translation(item.sideBarProps?.displayText)}
                icon={item.sideBarProps?.icon}
            >
                <MenuItem> Report 1</MenuItem>
                <MenuItem> Report 2</MenuItem>
            </StyledSubMenu>
        </Menu>
    );
};

const StyledSubMenu = styled(SubMenu)`
    color: white;
    & .ps-menu-button {
        &:hover,
        &.ps-active {
            background-color: ${sideBarConfig.colors.hoverBg} !important;
            color: ${sideBarConfig.colors.activeColor};

            & .ps-menu-icon,
            & .ps-menu-label {
                color: ${sideBarConfig.colors.activeColor};
            }
        }

        &:hover {
            background-color: ${sideBarConfig.colors.hoverBg} !important;
        }
    }
`;
