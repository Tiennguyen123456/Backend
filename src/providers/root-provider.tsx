import { ReactNode } from "react";
import { ToastProvider } from "./toast-provider";

interface RootProviderProps {
    children: ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
    return (
        <>
            {children}
            <ToastProvider />
        </>
    );
}
