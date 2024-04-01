"use client";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    return (
        <div className="p-4 flex flex-col h-full w-full items-center justify-center space-y-4 md:space-y-8">
            <p className="text-8xl md:text-9xl font-black">{translation("403page.title")}</p>
            <div className="flex flex-col items-center space-y-4 text-center">
                <p className="text-3xl md:text-5xl font-semibold capitalize">{translation("403page.subtitle")}</p>
                <p className="text-xl md:text-2xl text-muted-foreground up">{translation("403page.description")}</p>
            </div>
            <Button
                variant={"destructive"}
                onClick={() => router.push(ROUTES.DASHBOARD)}
            >
                {translation("action.backHome")}
            </Button>
        </div>
    );
}
