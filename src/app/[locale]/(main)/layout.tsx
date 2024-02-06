import { MainSidebar } from "@/components/layout/sidebar/main-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh overflow-hidden">
            <MainSidebar />
            <p>topbar</p>
            {children}
        </div>
    );
}
