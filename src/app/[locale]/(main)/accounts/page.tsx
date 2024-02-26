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
import { useAppSelector } from "@/redux/root/hooks";
import { selectUser } from "@/redux/user/slice";
import { isActionsPermissions } from "@/helpers/funcs";
import { ActionPermissions } from "@/constants/routes";
import { format } from "date-fns";
import { DateTimeFormat } from "@/constants/variables";

export default function AccountsPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** User Selector
    const { userPermissions } = useAppSelector(selectUser);
    // Use Row Selection
    const { rowSelection, onRowSelection } = useRowSelection();
    // Use Pagination
    const { limit, onPaginationChange, skip, pagination, page } = usePagination();
    // Use Sorting
    const { sorting, onSortingChange, field, order } = useSorting();

    // ** State
    const [openModal, setOpenModal] = useState(false);
    const [rowSelected, setRowSelected] = useState<AccountColumn | null>(null);
    const [paramsDataTable1, setParamsDataTable] = useState({
        search: {},
        filters: {},
    });

    // Use fetch data
    const { data, loading, pageCount, refresh, setRefresh } = useFetchDataTable<AccountColumn>({
        url: ApiRoutes.getAccounts,
        paramsDataTable: {
            ...paramsDataTable1,
            pagination: {
                page: page ?? 1,
                pageSize: limit ?? 1,
            },
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
            company_id: data?.company?.id ?? -1,
            company_name: data?.company?.name ?? "",
            role_id: data?.role?.id ?? -1,
            role_name: data?.role?.name ?? "",
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

    const isCreateAccount = () => {
        return isActionsPermissions(userPermissions, ActionPermissions.CREATE_ACCOUNT);
    };
    const isUpdateAccount = () => {
        return isActionsPermissions(userPermissions, ActionPermissions.UPDATE_ACCOUNT);
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
            accessorKey: "role_id",
            header: () => <div className="text-black font-bold">{translation("accountPage.table.role")}</div>,
            cell: ({ row }) => row.original.role?.name,
        },
        {
            accessorKey: "created_at",
            header: () => <div className="text-black font-bold">{translation("accountPage.table.createdAt")}</div>,
            cell: ({ row }) => format(row.original.created_at, DateTimeFormat),
        },
        {
            accessorKey: "status",
            header: () => <div className="text-black font-bold">{translation("accountPage.table.status")}</div>,
        },
        {
            id: "actions",
            header: () => <div className="text-black font-bold">{translation("datatable.action")}</div>,
            cell: ({ row }) =>
                isUpdateAccount() ? (
                    <CellAction
                        onRowSelected={() => handleEditRole(row.original)}
                        onRefetch={handleAfterCreate}
                        data={row.original}
                    />
                ) : (
                    ""
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
                        {isCreateAccount() ? (
                            <Button
                                variant={"secondary"}
                                onClick={handleCreateRole}
                            >
                                <PlusCircle className="w-5 h-5 md:mr-2" />
                                <p className="hidden md:block">{translation("action.create")}</p>
                            </Button>
                        ) : (
                            ""
                        )}
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
