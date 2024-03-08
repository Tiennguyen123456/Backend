import { AppRoutesPermissions, PRIVATE_ROUTES } from "@/constants/routes";
import { replaceIdInURLRegExp } from "@/constants/variables";
import { locales } from "@/i18n-configurations/config";

export function checkPermission(permissions: string[], action: string) {
    const index = permissions.findIndex((item) => item === action);
    if (index >= 0) return true;
    else return false;
}

export function removeLocaleFromPathname(pathname: string) {
    let newPath = pathname;

    for (let i = 0; i < locales.length; i++) {
        const locale = locales[i];
        if (pathname.startsWith(`/${locale}`)) {
            const splitPath = pathname.split(`/${locale}`);
            if (splitPath.length > 1) {
                newPath = splitPath[1];
                break;
            }
        }
    }

    return newPath;
}

export function removeNumberInPathname(pathname: string) {
    return pathname.replace(replaceIdInURLRegExp, "");
}

export function isMatchPrivateRoute(path: string) {
    path = removeNumberInPathname(path);
    let newPath = removeLocaleFromPathname(path);

    return PRIVATE_ROUTES.some((substr) => newPath.startsWith(substr));
}

export function checkPermissionForAccessSpecificPage(userPermissions: string[], pathname: string) {
    pathname = removeNumberInPathname(pathname);

    for (const route of AppRoutesPermissions) {
        if (route.path === pathname) {
            const hasPermission = route.permissions.every((permission) => checkPermission(userPermissions, permission));
            if (hasPermission) {
                return true;
            }
            return false;
        }
    }
    return true;
}

export function mergePermissionFromRoles(roles: { [x: string]: string[] }) {
    let tempPermissionsList: string[] = [];

    for (const [key, value] of Object.entries(roles)) {
        tempPermissionsList = [...tempPermissionsList, ...value];
    }

    let permissionsList: string[] = [];

    for (let i = 0; i < tempPermissionsList.length; i++) {
        const permission = tempPermissionsList[i];
        if (!permissionsList.includes(permission)) {
            permissionsList.push(permission);
        }
    }

    return permissionsList;
}
