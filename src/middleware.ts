import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Languages } from "./constants/enum";
import { locales } from "./i18n-configurations/config";

export default async function middleware(request: NextRequest) {
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
