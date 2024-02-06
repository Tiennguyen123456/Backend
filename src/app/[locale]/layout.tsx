import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700", "900"] });

export const metadata: Metadata = {
    title: "Check-in Dashboard",
    description: "Check-in Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // ** I18n
    const locale = useLocale();
    const messages = useMessages();

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages}
        >
            <html>
                <head>
                    <title>Check-in Dashboard</title>
                </head>

                <body className={roboto.className}>{children}</body>
            </html>
        </NextIntlClientProvider>
    );
}
