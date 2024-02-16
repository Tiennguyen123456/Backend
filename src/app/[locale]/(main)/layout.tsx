import { MainSidebar } from "@/components/layout/sidebar/main-sidebar";
import TopBar from "@/components/layout/topbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh overflow-hidden">
            <MainSidebar />
            <div className="flex-col w-full">
                <TopBar />
                <div className="w-full h-topbar-desktop overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}
