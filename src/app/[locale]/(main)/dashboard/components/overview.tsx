"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface OverviewProps {
    value: {
        [x: string]: string;
    } | null;
    loading: boolean;
}
interface OverviewData {
    name: string;
    total: string;
}

export function Overview({ value, loading }: OverviewProps) {
    const [data, setData] = useState<OverviewData[] | null>(null);
    useEffect(() => {
        if (value) {
            let formatData: OverviewData[] = [];
            for (const [k, v] of Object.entries(value)) {
                formatData.push({ name: k, total: v });
            }
            setData(formatData);
        }
    }, [value]);
    return (
        <>
            {loading || !data ? (
                <Skeleton className="h-[300px] w-full rounded-xl" />
            ) : (
                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            tickLine={true}
                            axisLine={true}
                        />
                        <YAxis
                            fontSize={12}
                            tickLine={true}
                            axisLine={true}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="total"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </>
    );
}
