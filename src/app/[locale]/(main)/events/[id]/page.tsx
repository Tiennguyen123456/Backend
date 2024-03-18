"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { TabNav } from "./components/tab-nav";
import InformationClient from "./components/information-client";
import eventApi from "@/services/event-api";
import { toastError } from "@/utils/toast";
import { IEventRes } from "@/models/api/event-api";
import { ROUTES } from "@/constants/routes";
import CustomFieldsClient from "./components/custom-field-client";

interface tabItem {
    id: number;
    title: string;
}

export default function EventDetailsPage({ params }: { params: { id: number } }) {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    // TabItem
    const sidebarNavItems: tabItem[] = [
        {
            id: 1,
            title: translation("eventDetailsPage.tab.information"),
        },
        {
            id: 2,
            title: translation("eventDetailsPage.tab.customFields"),
        },
    ];

    // ** UseState
    const [tab, setTab] = useState<Number>(1);
    const [data, setData] = useState<IEventRes>();
    const [loading, setLoading] = useState(true);

    const handleGetEventById = async () => {
        try {
            setLoading(true);
            if (params.id) {
                const response = await eventApi.getEventById(params.id);
                if (response.status === "success") {
                    const data = response?.data;
                    setData(data);
                }
            }
        } catch (error: any) {
            toastError(translation("errorApi.GET_EVENT_INFORMATION_FAILED"));
            router.push(ROUTES.EVENTS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetEventById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return null;
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
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 px-0 2xl:px-16">
                <aside className="-mx-1 md:-mx-4 lg:w-1/5 overflow-x-auto">
                    <TabNav
                        items={sidebarNavItems}
                        keySelected={Number(tab)}
                        setKeySelected={setTab}
                    />
                </aside>
                <div className="flex-1 w-full">
                    <div className="space-y-5">
                        {tab == 1 ? (
                            <InformationClient
                                data={data}
                                onRefresh={handleGetEventById}
                            />
                        ) : (
                            <CustomFieldsClient
                                eventId={params.id}
                                data={data}
                                onRefresh={handleGetEventById}
                            />
                        )}
                    </div>
                </div>
            </div>
            <FooterContainer />
        </>
    );
}
