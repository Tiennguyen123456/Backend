"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { ToastProvider } from "@/providers/toast-provider";

interface ProviderProps {
    children: ReactNode;
}

export default function Providers({ children }: ProviderProps) {
    return (
        <Provider store={store}>
            {children}
            <ToastProvider />
        </Provider>
    );
}
