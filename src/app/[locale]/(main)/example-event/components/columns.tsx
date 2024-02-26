"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export type EventsColumn = {
    id: number;
    name: string;
    code: string;
    startDate: string;
    endDate: string;
    numberGuest: number;
    status: string;
};

export const columns: ColumnDef<EventsColumn>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
    },
    {
        accessorKey: "name",
        header: "Event Name",
    },
    {
        accessorKey: "code",
        header: "Event Code",
    },
    {
        accessorKey: "startDate",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Start Date"
            />
        ),
        cell: ({ row }) => {
            return format(row.original.startDate, "yyyy-MM-dd HH:mm:ss");
        },
    },
    {
        accessorKey: "endDate",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="End Date"
            />
        ),
        cell: ({ row }) => {
            return format(row.original.endDate, "yyyy-MM-dd HH:mm:ss");
        },
    },
    {
        accessorKey: "numberGuest",
        header: "Number Of Guest",
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Status"
            />
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
