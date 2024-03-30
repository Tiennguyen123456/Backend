"use client";
import { ILandingPageRes } from "@/models/api/landing-page-api";
import StoreLandingPageComponent from "../components/store-landing-page";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/layout/loading-page";

interface UpdateLandingPageProps {
    params: {
        id: number;
        landingPageId: number;
    };
}
export default function UpdateLandingPage({ params }: UpdateLandingPageProps) {
    const [loading, setLoading] = useState<Boolean>(true);
    const [data, setData] = useState<ILandingPageRes | null>(null);

    useEffect(() => {
        setLoading(false);
        const dataRes: ILandingPageRes = {
            id: 1,
            event_id: 12,
            name: "Test name",
            slug: "/slug-name",
            title: "Test title",
            subtitle: "Test subtitle",
            content: "Test content",
            status: "ACTIVE",
            background_img: "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
            form_enable: 1,
            form_title: "Test form title",
            form_description: "Test form description",
            form_input: ["name", "phone"],
            created_at: "2021-01-01 00:00:00",
            updated_at: "2021-01-01 00:00:00",
        };
        setData(dataRes);
    }, []);

    if (loading) return <LoadingPage />;

    return (
        <>
            <StoreLandingPageComponent defaultData={data} />
        </>
    );
}
