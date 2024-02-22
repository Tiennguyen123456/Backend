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
import { CellAction } from "./components/cell-action";
import { RoleColumn } from "./components/column";
import FooterContainer from "@/components/layout/footer-container";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { useFetchDataRole } from "@/data/fetch-data-role";

export default function CompaniesPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** Use Router
    const router = useRouter();

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
    const { data, loading, pageCount } = useFetchDataRole({ pagination: { page, pageSize: limit } });


    const columns: ColumnDef<RoleColumn>[] = [
        {
            accessorKey: "name",
            header: translation("rolesPage.table.name"),
        },
        {
            accessorKey: "guard_name",
            header: translation("rolesPage.table.guardName"),
        },
        {
            accessorKey: "enable",
            accessorFn: row => row.enable === 1 ? 'true' : 'false',
            header: translation("rolesPage.table.enable"),
        },
        {
            id: "actions",
            header: translation("rolesPage.table.action"),
            cell: ({ row }) => <CellAction data={row.original} />,
        },
    ];

    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("rolesPage.title")}</h2>
                    <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                        <Button
                            variant={"secondary"}
                        >
                            <PlusCircle className="w-5 h-5 md:mr-2" />
                            <p className="hidden md:block">{translation("action.create")}</p>
                        </Button>
                    </div>
                </div>
            </div>

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
            <FooterContainer />
        </>
    );
}
