"use client";

import { ROUTES } from "@/constants/routes";
import { generateBreadcrumbs } from "@/helpers/funcs";
import { IRouterBreadcrumbs } from "@/models/Route";
import clsx from "clsx";
import { Home, HomeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Breadcrumbs = () => {
    // ** I18n
    const translation = useTranslations("breadcrumb");

    // ** Router
    const pathname = usePathname();

    // ** State
    const [breadcrumbs, setBreadcrumbs] = useState<IRouterBreadcrumbs[]>([]);

    useEffect(() => {
        setBreadcrumbs(generateBreadcrumbs());
    }, [pathname]);

    return (
        <div className="flex gap-x-2 items-center">
            <Link
                key={ROUTES.DASHBOARD}
                href={ROUTES.DASHBOARD}
                className="text-gray-500 font-normal"
            >
                <HomeIcon className="w-5 h-5" />
            </Link>
            {breadcrumbs.map((item, index) => (
                <Link
                    key={item.slug}
                    href={item.slug}
                    className={clsx("font-normal", index === breadcrumbs.length - 1 ? "text-black" : "text-gray-500")}
                >
                    {`/ ${translation(item.code)}`}
                </Link>
            ))}
        </div>
    );
};

export default Breadcrumbs;
