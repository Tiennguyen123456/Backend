"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import React, { useState } from "react";
import CardTotal from "./components/card-total";
import { useTranslations } from "next-intl";
import { CalendarClock, LayoutList, MonitorPlay, PauseOctagon } from "lucide-react";

export default function DashboardPage() {
    // ** I18n
    const translation = useTranslations();

    // Use state
    const [dateFrom, setDateFrom] = useState<Date>();
    const [dateTo, setDateTo] = useState<Date>();
    // console.log("dateFrom: ", dateFrom ? format(dateFrom, "yyyy-MM-dd HH:mm:ss") : "");

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
                        />
                        <DateTimePicker
                            disabled={false}
                            title={"Pick a date to"}
                            date={dateTo}
                            setDate={setDateTo}
                        />
                    </div>
                    <Button>Search</Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CardTotal
                    title={`${translation("dashboardPage.card.totalEvent")}`}
                    icon={<LayoutList className="h-5 w-5 text-muted-foreground" />}
                />
                <CardTotal
                    title={`${translation("dashboardPage.card.upcomingEvent")}`}
                    icon={<CalendarClock className="h-5 w-5 text-muted-foreground" />}
                />
                <CardTotal
                    title={`${translation("dashboardPage.card.eventTakingPlace")}`}
                    icon={<MonitorPlay className="h-5 w-5 text-muted-foreground" />}
                />
                <CardTotal
                    title={`${translation("dashboardPage.card.pausedEvent")}`}
                    icon={<PauseOctagon className="h-5 w-5 text-muted-foreground" />}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* <Overview /> */}
                        Chart
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>You made 265 sales this month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* <RecentSales /> */}
                        Table
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
