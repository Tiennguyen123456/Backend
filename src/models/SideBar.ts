import { ReactNode } from "react";

export interface SideBarItemType {
  key: string;
  path?: string;
  group?: {
    name: string;
    child: SideBarItemType[];
  };
  child?: SideBarItemType[];
  sideBarProps?: {
    displayText: string;
    icon?: ReactNode;
  };
  permissions: string[];
}
