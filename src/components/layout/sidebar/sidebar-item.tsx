import sideBarConfig from "@/configs/SideBarConfig";
import { SideBarItemType } from "@/models/SideBar";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Menu, MenuItem, MenuItemStyles, menuClasses } from "react-pro-sidebar";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { checkCurrentPath } from "@/helpers/funcs";

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

export const SideBarItem: React.FC<Props> = ({ item }) => {
    // ** Router
    const router = useRouter();
    const pathname = usePathname();

    // ** I18n
    const translation = useTranslations();
    const locale = useLocale();

    // ** State
    const [active, setActive] = useState<boolean>(false);
    useEffect(() => {
        const currPage = checkCurrentPath(pathname);
        setActive(currPage === item.path);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // ** Functions
    const handleClick = () => {
        if (item.path) {
            router.push(locale ? `/${locale}/${item.path}` : item.path);
        }
    };

    if (!item.sideBarProps) {
        return null;
    }

    return (
        <Menu menuItemStyles={menuItemStyles}>
            <StyledMenuItem
                icon={item.sideBarProps?.icon}
                onClick={handleClick}
                active={active}
            >
                {translation(item.sideBarProps?.displayText)}
            </StyledMenuItem>
        </Menu>
    );
};

const StyledMenuItem = styled(MenuItem)`
    position: relative;
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

            &::after {
                content: "";
                position: absolute;
                right: 0;
                height: 100%;
                width: 4px;
                background-color: ${sideBarConfig.colors.activeColor};
            }
        }
    }
`;
