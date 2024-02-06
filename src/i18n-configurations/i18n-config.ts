import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { Languages } from "../constants/enum";
import { locales } from "./config";

const handleGetTranslationFileName = (locale: string) => {
    switch (locale) {
        case Languages.English:
            return "en";
        case Languages.VietNamese:
            return "vi";
    }
};

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) notFound();

    const translationFileName = handleGetTranslationFileName(locale);

    return {
        messages: (await import(`../locales/${translationFileName}.json`)).default,
    };
});
