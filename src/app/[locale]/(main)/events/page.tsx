"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslations } from "next-intl";
import { PlusCircle, Trash2 } from "lucide-react";
import { EventsColumn, columns } from "./components/columns";
import { DataTable } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/use-pagination";
import { useRowSelection } from "@/hooks/use-row-selection";

export default function DashboardPage() {
    // ** I18n
    const translation = useTranslations();

    // Use Pagination
    const { limit, onPaginationChange, skip, pagination } = usePagination();
    const pageCount = Math.round(5 / limit);

    // Use Row Selection
    const { rowSelection, onRowSelection } = useRowSelection();
    console.log(Object.keys(rowSelection).map(Number));

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
        <div className="flex-1 space-y-4 p-6 pt-8">
            <div className="w-full flex flex-wrap items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{translation("sidebar.items.events")}</h2>
                <div className="flex justify-end flex-wrap items-center gap-2">
                    <Button variant={"secondary"}>
                        <PlusCircle className="w-5 h-5 md:mr-2" />
                        <p className="hidden md:block">{translation("action.create")}</p>
                    </Button>
                    <Button variant={"destructive"}>
                        <Trash2 className="w-5 h-5 md:mr-2" />
                        <p className="hidden md:block">{translation("action.delete")}</p>
                    </Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={data}
                // Pagination
                onPaginationChange={onPaginationChange}
                pageCount={pageCount}
                pagination={pagination}
                // Row selected
                onRowSelectionChange={onRowSelection}
                rowSelection={rowSelection}
            />
        </div>
    );
}
