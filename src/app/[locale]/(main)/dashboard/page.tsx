"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import React, { useState } from "react";
import CardTotal from "./components/card-total";
import { useTranslations } from "next-intl";
import { LayoutList, MonitorPlay, PauseOctagon } from "lucide-react";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { useFetchDashboardReport } from "@/data/fetch-dashboard-report";
import { DateFormat, DateFormatServer } from "@/constants/variables";
import { Overview } from "./components/overview";
import FooterContainer from "@/components/layout/footer-container";

export default function DashboardPage() {
    // ** I18n
    const translation = useTranslations();

    // Use state
    const currentDate = new Date();
    const [dateFrom, setDateFrom] = useState<Date | undefined>(startOfDay(subDays(currentDate, 7)));
    const [dateTo, setDateTo] = useState<Date | undefined>(endOfDay(currentDate));

    // Use fetch data
    const { data, loading, reCall, setReCall } = useFetchDashboardReport({
        from: dateFrom ? format(dateFrom, DateFormatServer) : "",
        to: dateTo ? format(dateTo, DateFormatServer) : "",
    });

    return (
        <>
            <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{translation("sidebar.items.dashboard")}</h2>
                <div className="flex flex-col md:flex-row gap-2 items-end w-full md:w-auto">
                    <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
                        <DateTimePicker
                            disabled={false}
                            title={"Pick a date from"}
                            date={dateFrom}
                            setDate={setDateFrom}
                            onTimePicker={false}
                            formatDate={DateFormat}
                        />
                        <DateTimePicker
                            disabled={false}
                            title={"Pick a date to"}
                            date={dateTo}
                            setDate={(value) => setDateTo(value)}
                            onTimePicker={false}
                            formatDate={DateFormat}
                        />
                    </div>
                    <Button
                        disabled={Boolean(loading)}
                        onClick={() => setReCall(!reCall)}
                    >
                        Search
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <CardTotal
                    title={`${translation("dashboardPage.card.totalEvent")}`}
                    icon={<LayoutList className="h-5 w-5 text-muted-foreground" />}
                    amount={data?.status.TOTAL || 0}
                />
                <CardTotal
                    title={`${translation("dashboardPage.card.eventActive")}`}
                    icon={<MonitorPlay className="h-5 w-5 text-muted-foreground" />}
                    amount={data?.status.ACTIVE || 0}
                />
                <CardTotal
                    title={`${translation("dashboardPage.card.eventInActive")}`}
                    icon={<PauseOctagon className="h-5 w-5 text-muted-foreground" />}
                    amount={data?.status.INACTIVE || 0}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{translation("dashboardPage.chart")}</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview
                            loading={Boolean(loading)}
                            value={data?.count_by_date || []}
                        />
                    </CardContent>
                </Card>
            </div>
            <FooterContainer />
        </>
    );
}
