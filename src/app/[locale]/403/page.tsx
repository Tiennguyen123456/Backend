"use client";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col h-full w-full items-center justify-center space-y-6">
            <p className="text-9xl font-black">403</p>
            <div className="flex flex-col items-center space-y-3">
                <p className="text-5xl font-semibold">Access Denied</p>
                <p className="text-2xl text-muted-foreground">You do not have permission to access this page !</p>
            </div>
            <Button onClick={() => router.push(ROUTES.DASHBOARD)}>Back Dashboar</Button>
        </div>
    );
}
