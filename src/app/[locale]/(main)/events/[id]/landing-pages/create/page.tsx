"use client";
import { ILandingPageRes } from "@/models/api/landing-page-api";
import StoreLandingPageComponent from "../components/store-landing-page";

export default function CreateLandingPage() {
    return (
        <>
            <StoreLandingPageComponent defaultData={null} />
        </>
    );
}
