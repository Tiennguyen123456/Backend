import ApiRoutes from "@/services/api.routes";
import { unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import LandingPageClient from "./components/landing-page-client";
import { ROUTES } from "@/constants/routes";

export const dynamic = "force-static";
// export const dynamicParams = true
// const locales = ['en', 'vi'];
export async function generateStaticParams() {
    return [];
}

async function getLandingPageBySlug(slug: string) {
    const url = ApiRoutes.getPostBySlug + slug;
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) {
        return null;
    }
    return res.json();
}

export default async function LandingPage({ params }: { params: { locale: string; slug: string } }) {
    unstable_setRequestLocale(params.locale);
    const response = await getLandingPageBySlug(params.slug);
    if (!response) {
        redirect(ROUTES.DASHBOARD);
    }
    const post = response.data;
    return (
        <>
            <LandingPageClient data={post} />
        </>
    );
}
