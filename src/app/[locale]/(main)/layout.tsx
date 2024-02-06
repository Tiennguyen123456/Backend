import { MainSidebar } from "@/components/layout/sidebar/main-sidebar";
import TopBar from "@/components/layout/topbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh overflow-hidden">
            <MainSidebar />
            <div className="flex-1">
                <TopBar />
                <div className="h-topbar-desktop overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}
