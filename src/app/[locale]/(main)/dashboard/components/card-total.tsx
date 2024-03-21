import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface CardTotalProps {
    title: string;
    amount: number;
    icon: ReactNode;
}

export default function CardTotal({ title, icon, amount }: CardTotalProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium capitalize">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{amount}</div>
            </CardContent>
        </Card>
    );
}
