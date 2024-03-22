"use client";
import LoadingPage from "@/components/layout/loading-page";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    // ** I18n
    const translation = useTranslations();

    // ** State
    const [loading, setLoading] = useState(true);

    return <div className="flex h-dvh">{children}</div>;
}
