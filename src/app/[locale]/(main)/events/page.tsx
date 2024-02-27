"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusCircle, Trash2 } from "lucide-react";
import { EventsColumn, columns } from "./components/columns";
import { DataTable } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/use-pagination";
import { useRowSelection } from "@/hooks/use-row-selection";
import { useSorting } from "@/hooks/use-sorting";
import { DateyTimePicker } from "@/components/ui/date-time-picker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DashboardPage() {
    // ** I18n
    const translation = useTranslations();

    // Use state
    const [dateFrom, setDateFrom] = useState<Date>();
    const [dateTo, setDateTo] = useState<Date>();

    // Use Pagination
    const { limit, onPaginationChange, skip, pagination, page } = usePagination();
    const totalRecord = 50;
    const pageCount = Math.round(totalRecord / limit);

    // Use Sorting
    const { sorting, onSortingChange, field, order } = useSorting();

    // Use Row Selection
    const { rowSelection, onRowSelection } = useRowSelection();

    const data: EventsColumn[] = [
        {
            id: 1,
            name: "Event 1",
            code: "EVENT1",
            startDate: "2023-12-31 18:00:00",
            endDate: "2023-12-31 21:00:00",
            numberGuest: 10,
            status: "NEW",
        },
        {
            id: 2,
            name: "Event 2",
            code: "EVENT2",
            startDate: "2023-12-31 18:00:00",
            endDate: "2023-12-31 21:00:00",
            numberGuest: 12,
            status: "ACTIVE",
        },
        {
            id: 3,
            name: "Event 3",
            code: "EVENT3",
            startDate: "2023-12-31 18:00:00",
            endDate: "2023-12-31 21:00:00",
            numberGuest: 11,
            status: "INACTIVE",
        },
    ];

    return (
        <>
            <div className="w-full flex flex-wrap items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{translation("sidebar.items.events")}</h2>
                <div className="flex justify-end flex-wrap items-center gap-2">
                    <Button variant={"secondary"}>
                        <PlusCircle className="w-5 h-5 md:mr-2" />
                        <p className="hidden md:block">{translation("action.create")}</p>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 justify-start items-end w-full md:w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="NEW">New</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="DEACTIVE">DeActive</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <DateyTimePicker
                        title={"Pick a date from"}
                        date={dateFrom}
                        setDate={setDateFrom}
                    />
                    <DateyTimePicker
                        title={"Pick a date to"}
                        date={dateTo}
                        setDate={setDateTo}
                    />
                </div>
                <Button>Search</Button>
            </div>
            <DataTable
                loading={true}
                columns={columns}
                data={data}
                // Pagination
                onPaginationChange={onPaginationChange}
                pageCount={pageCount}
                pagination={pagination}
                // Row selected
                onRowSelectionChange={onRowSelection}
                rowSelection={rowSelection}
                // Sorting
                onSortingChange={onSortingChange}
                sorting={sorting}
            />
        </>
    );
}
