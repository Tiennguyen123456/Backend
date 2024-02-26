"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/use-pagination";
import { useRowSelection } from "@/hooks/use-row-selection";
import { useSorting } from "@/hooks/use-sorting";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./components/cell-action";
import { AccountColumn } from "./components/column";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { AccountModal } from "./components/account-modal";
import { useFetchDataTable } from "@/data/fetch-data-table";
import ApiRoutes from "@/services/api.routes";
import { IAccountRes } from "@/models/api/account-api";

export default function AccountsPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** State
    const [openModal, setOpenModal] = useState(false);
    const [rowSelected, setRowSelected] = useState<AccountColumn | null>(null);

    // Use Row Selection
    const { rowSelection, onRowSelection } = useRowSelection();
    // Use Pagination
    const { limit, onPaginationChange, skip, pagination, page } = usePagination();
    // Use Sorting
    const { sorting, onSortingChange, field, order } = useSorting();
    // Use fetch data
    const { data, loading, pageCount, refresh, setRefresh } = useFetchDataTable<IAccountRes>({
        url: ApiRoutes.getAccouts,
        params: {
            pagination: { page, limit },
        },
    });

    // Func
    const handleAfterCreate = () => {
        setRefresh(!refresh);
    };

    const handleEditRole = (data: AccountColumn) => {
        setRowSelected({
            ...data,
            name: data.name ?? "",
            username: data.username ?? "",
            email: data.email ?? "",
            company_id: data.company_id ?? -1,
            role_id: data.role_id ?? -1,
        });
        setOpenModal(true);
    };

    const handleCreateRole = () => {
        setRowSelected(null);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setRowSelected(null);
        setOpenModal(false);
    };

    const columns: ColumnDef<AccountColumn>[] = [
        {
            accessorKey: "name",
            header: () => <div className="text-black font-bold">{translation("accountPage.table.name")}</div>,
        },
        {
            accessorKey: "email",
            header: () => <div className="text-black font-bold">{translation("accountPage.table.email")}</div>,
        },
        {
            accessorKey: "role_nam",
            header: () => <div className="text-black font-bold">{translation("accountPage.table.role")}</div>,
        },
        {
            accessorKey: "created_at",
            header: () => <div className="text-black font-bold">{translation("accountPage.table.createdAt")}</div>,
        },
        {
            accessorKey: "status",
            header: () => <div className="text-black font-bold">{translation("accountPage.table.status")}</div>,
        },
        {
            id: "actions",
            header: () => <div className="text-black font-bold">{translation("datatable.action")}</div>,
            cell: ({ row }) => (
                <CellAction
                    onRowSelected={() => handleEditRole(row.original)}
                    onRefetch={handleAfterCreate}
                    data={row.original}
                />
            ),
        },
    ];

    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("accountPage.title")}</h2>
                    <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                        <AccountModal
                            className="sm:max-w-[460px] overflow-y-auto"
                            isOpen={openModal}
                            onClose={handleCloseModal}
                            defaultData={rowSelected}
                            onConfirm={handleAfterCreate}
                        />
                        <Button
                            variant={"secondary"}
                            onClick={handleCreateRole}
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
