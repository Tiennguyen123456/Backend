"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusCircle, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/use-pagination";
import { useRowSelection } from "@/hooks/use-row-selection";
import { useSorting } from "@/hooks/use-sorting";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ICompanyRes } from "@/models/api/company-api";
import { CellAction } from "./components/cell-action";
import { useFetchDataCompany } from "@/data/fetch-data-company";

export default function CompanyPage() {
    // ** I18n
    const translation = useTranslations("");

    // Use Date From To
    const [dateFrom, setDateFrom] = useState<Date>();
    const [dateTo, setDateTo] = useState<Date>();

    // Use Row Selection
    const { rowSelection, onRowSelection } = useRowSelection();

    // Use Pagination
    const { limit, onPaginationChange, skip, pagination, page } = usePagination();

    // Use Sorting
    const { sorting, onSortingChange, field, order } = useSorting();

    // Use fetch data
    const { data, loading, pageCount } = useFetchDataCompany({ pagination: { page, perPage: limit } });

    const columns: ColumnDef<ICompanyRes>[] = [
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
            header: translation("companyPage.table.name"),
        },
        {
            accessorKey: "website",
            header: translation("companyPage.table.website"),
        },
        {
            accessorKey: "email",
            header: translation("companyPage.table.email"),
        },
        {
            accessorKey: "address",
            header: translation("companyPage.table.address"),
        },
        {
            accessorKey: "phone",
            header: translation("companyPage.table.phone"),
        },
        {
            accessorKey: "status",
            header: translation("companyPage.table.status"),
        },
        {
            id: "actions",
            cell: ({ row }) => <CellAction data={row.original} />,
        },
    ];

    return (
        <>
            <div className="w-full flex flex-wrap items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{translation("companyPage.title")}</h2>
                <div className="flex justify-end flex-wrap items-center gap-2">
                    <Button variant={"secondary"}>
                        <PlusCircle className="w-5 h-5 md:mr-2" />
                        <p className="hidden md:block">{translation("action.create")}</p>
                    </Button>
                    {/* <Button variant={"destructive"}>
                        <Trash2 className="w-5 h-5 md:mr-2" />
                        <p className="hidden md:block">{translation("action.delete")}</p>
                    </Button> */}
                </div>
            </div>
            {/* <div className="flex flex-col md:flex-row gap-2 justify-end items-end w-full md:w-auto">
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
            </div> */}
            <DataTable
                loading={loading}
                columns={columns}
                data={data}
                // Pagination
                onPaginationChange={onPaginationChange}
                pageCount={Number(pageCount)}
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
