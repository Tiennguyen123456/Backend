"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    keySelected: number;
    setKeySelected: (id: number) => void;
    items: {
        id: number;
        title: string;
    }[];
}

export function TabNav({ className, items, keySelected, setKeySelected, ...props }: SidebarNavProps) {
    const pathname = usePathname();

    return (
        <nav
            className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}
            {...props}
        >
            {items.map((item) => (
                <div
                    onClick={() => setKeySelected(item.id)}
                    key={item.id}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        item.id === keySelected ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                        "justify-start cursor-pointer",
                    )}
                >
                    {item.title}
                </div>
            ))}
        </nav>
    );
}
