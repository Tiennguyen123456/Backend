"use client";
import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { TabNav } from "./components/tab-nav";
import InfoForm from "./components/info-form";
import TemplateMailForm from "./components/template-mail-form";
import SettingsForm from "./components/setting-form";

interface tabItem {
    id: number;
    title: string;
    description: string;
    components: React.ReactNode;
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
    const sidebarNavItems = useMemo<tabItem[]>(
        () => [
            {
                id: 1,
                title: "Information",
                description: "This is how others will see you on the site.",
                components: <InfoForm id={params.id} />,
            },
            {
                id: 2,
                title: "Template email",
                description: "This is how others will see you on the site.",
                components: <TemplateMailForm id={params.id} />,
            },
            {
                id: 3,
                title: "Setting",
                description: "This is how others will see you on the site.",
                components: <SettingsForm id={params.id} />,
            },
        ],
        [],
    );
    // ** I18n
    const translation = useTranslations("");

    const [tab, setTab] = useState<Number>(1);

    // ** Router
    const router = useRouter();

    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("eventDetailsPage.title")}</h2>
                    <div className="flex justify-end flex-wrap items-center gap-2 !mt-0"></div>
                </div>
            </div>
            <Separator />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-1 md:-mx-4 lg:w-1/5 overflow-x-auto">
                    <TabNav
                        items={sidebarNavItems}
                        keySelected={Number(tab)}
                        setKeySelected={setTab}
                    />
                </aside>
                <div className="flex-1 lg:max-w-2xl">
                    <div className="space-y-6">
                        {sidebarNavItems
                            .filter((item) => item.id == tab)
                            .map((item) => (
                                <div
                                    className="space-y-6"
                                    key={item.id}
                                >
                                    <div>
                                        <h3 className="text-lg font-medium">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                    <Separator />
                                    {item.components}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <FooterContainer />
        </>
    );
}
