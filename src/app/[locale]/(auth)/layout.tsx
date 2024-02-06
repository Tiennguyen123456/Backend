import { ToastProvider } from "@/providers/toast-provider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ToastProvider />
            {children}
        </>
    );
}
