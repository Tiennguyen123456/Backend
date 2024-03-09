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
import { RoleColumn } from "./components/column";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { RoleModal } from "./components/role-modal";
import { useFetchDataTable } from "@/data/fetch-data-table";
import { IRoleRes } from "@/models/api/role-api";
import ApiRoutes from "@/services/api.routes";
import { RoleEnable } from "@/constants/enum";
import { selectUser } from "@/redux/user/slice";
import { useAppSelector } from "@/redux/root/hooks";
import { isActionsPermissions } from "@/helpers/funcs";
import { ActionPermissions } from "@/constants/routes";

export default function CompaniesPage() {
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
    const [rowSelected, setRowSelected] = useState<RoleColumn | null>(null);
    const [paramsDataTable, setParamsDataTable] = useState({
        search: {},
        filters: {},
    });

    // Use fetch data
    const { data, loading, pageCount, refresh, setRefresh } = useFetchDataTable<IRoleRes>({
        url: ApiRoutes.getRoles,
        paramsDataTable: {
            ...paramsDataTable,
            pagination: {
                page: page ?? 1,
                pageSize: limit ?? 1,
            },
        },
    });

    // Func
    const handleReFreshDataTable = () => {
        setRefresh(!refresh);
    };

    const handleEditRole = (data: RoleColumn) => {
        setRowSelected({
            ...data,
            name: data.name ?? "",
            guard_name: data.guard_name,
            enable: data.enable,
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

    const canCreateRole = isActionsPermissions(userPermissions, ActionPermissions.CREATE_ROLE);
    const canUpdateRole = isActionsPermissions(userPermissions, ActionPermissions.UPDATE_ROLE);

    const columns: ColumnDef<RoleColumn>[] = [
        {
            accessorKey: "name",
            header: () => <div className="text-black font-bold">{translation("rolesPage.table.name")}</div>,
        },
        {
            accessorKey: "guard_name",
            header: () => <div className="text-black font-bold">{translation("rolesPage.table.guardName")}</div>,
        },
        {
            accessorKey: "enable",
            accessorFn: (row) => (row.enable === RoleEnable.Active ? "true" : "false"),
            header: () => <div className="text-black font-bold">{translation("rolesPage.table.enable")}</div>,
        },
        {
            id: "actions",
            header: () => <div className="text-black font-bold">{translation("datatable.action")}</div>,
            cell: ({ row }) =>
                canUpdateRole && (
                    <CellAction
                        onRowSelected={() => handleEditRole(row.original)}
                        onRefetch={handleReFreshDataTable}
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
                    <h2 className="text-3xl font-bold tracking-tight">{translation("rolesPage.title")}</h2>
                    <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                        <RoleModal
                            className="sm:max-w-[460px] overflow-y-auto"
                            isOpen={openModal}
                            onClose={handleCloseModal}
                            defaultData={rowSelected}
                            onConfirm={handleReFreshDataTable}
                        />
                        {canCreateRole && (
                            <Button
                                variant={"secondary"}
                                onClick={handleCreateRole}
                            >
                                <PlusCircle className="w-5 h-5 md:mr-2" />
                                <p className="hidden md:block">{translation("action.create")}</p>
                            </Button>
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
