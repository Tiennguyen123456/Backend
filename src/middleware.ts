import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Languages } from "./constants/enum";
import { locales } from "./i18n-configurations/config";
import { ROUTES } from "./constants/routes";
import { checkPermissionForAccessSpecificPage, isMatchPrivateRoute, removeLocaleFromPathname } from "./utils/common";

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("authorization");
    const userPermissions = request.cookies.get("userPermissions");

    // Check if path = / to page dashboard
    if (pathname === "/") {
        return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }

    // Check token for routes private
    if (!token?.value && isMatchPrivateRoute(pathname)) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }

    // check page login when logged
    if (token?.value && !isMatchPrivateRoute(pathname)) {
        return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }

    // check permission router
    if (userPermissions?.value) {
        const parseUserPermissions = JSON.parse(userPermissions.value) as string[];
        const urlWithoutLocale = removeLocaleFromPathname(pathname);

        const hasPermissionAccessCurrPage = checkPermissionForAccessSpecificPage(
            parseUserPermissions,
            urlWithoutLocale,
        );

        if (!hasPermissionAccessCurrPage) {
            return NextResponse.redirect(new URL(ROUTES.FORBIDDEN, request.url));
        }
    }

    // Config I18 locale
    const handleI18nRouting = createMiddleware({
        locales: locales,
        defaultLocale: Languages.English,
        localeDetection: false,
        localePrefix: "as-needed",
    });

    const response = handleI18nRouting(request);
    return response;
}

export const config = {
    // Match only internationalized pathnames
    matcher: "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
};
