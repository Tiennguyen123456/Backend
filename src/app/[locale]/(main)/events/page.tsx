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
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { useFetchDataTable } from "@/data/fetch-data-table";
import ApiRoutes from "@/services/api.routes";
import { isActionsPermissions } from "@/helpers/funcs";
import { useAppSelector } from "@/redux/root/hooks";
import { selectUser } from "@/redux/user/slice";
import { ActionPermissions, ROUTES } from "@/constants/routes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IEventRes } from "@/models/api/event-api";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DateTimeFormat } from "@/constants/variables";

export default function EventsPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    // ** User Selector
    const { userPermissions } = useAppSelector(selectUser);

    // Use Row Selection
    const { rowSelection, onRowSelection } = useRowSelection();
    // Use Pagination
    const { limit, onPaginationChange, skip, pagination, page } = usePagination();
    // Use Sorting
    const { sorting, onSortingChange, field, order } = useSorting();

    // ** State
    const [paramsSearch, setParamsSearch] = useState({
        search: {},
        filters: {},
    });
    const [paramsDataTable, setParamsDataTable] = useState({
        search: {},
        filters: {},
    });

    // Use fetch data
    const { data, loading, pageCount } = useFetchDataTable<IEventRes>({
        url: ApiRoutes.getEvents,
        paramsDataTable: {
            ...paramsDataTable,
            pagination: {
                page: page ?? 1,
                pageSize: limit ?? 1,
            },
        },
    });

    // Function
    const isCreateEvent = () => {
        return isActionsPermissions(userPermissions, ActionPermissions.CREATE_EVENT);
    };
    const isUpdateEvent = () => {
        return isActionsPermissions(userPermissions, ActionPermissions.UPDATE_EVENT);
    };
    const isAssetClientEvent = () => {
        return isActionsPermissions(userPermissions, ActionPermissions.DELETE_EVENT);
    };
    const handleSearchTaxcode = (event: any) => {
        setParamsSearch({ ...paramsSearch, filters: { ...paramsSearch.filters, tax_code: event.target.value } });
    };
    const handleSearchName = (event: any) => {
        setParamsSearch({ ...paramsSearch, search: { ...paramsSearch.search, name: event.target.value } });
    };
    const handleClickSearch = () => {
        setParamsDataTable({ ...paramsDataTable, search: paramsSearch.search, filters: paramsSearch.filters });
    };
    const columns: ColumnDef<IEventRes>[] = [
        {
            accessorKey: "code",
            header: () => <div className="text-black font-bold">{translation("eventPage.table.code")}</div>,
        },
        {
            accessorKey: "name",
            header: () => <div className="text-black font-bold">{translation("eventPage.table.name")}</div>,
        },
        {
            accessorKey: "start_time",
            header: () => <div className="text-black font-bold">{translation("eventPage.table.startTime")}</div>,
            cell: ({ row }) => format(row.original.start_time, DateTimeFormat),
        },
        {
            accessorKey: "end_time",
            header: () => <div className="text-black font-bold">{translation("eventPage.table.endTime")}</div>,
            cell: ({ row }) => format(row.original.end_time, DateTimeFormat),
        },
        {
            accessorKey: "status",
            header: () => <div className="text-black font-bold">{translation("eventPage.table.status")}</div>,
        },
        {
            id: "actions",
            header: () => <div className="text-black font-bold">{translation("datatable.action")}</div>,
            cell: ({ row }) => (!isUpdateEvent() && !isAssetClientEvent() ? "" : <CellAction data={row.original} />),
        },
    ];

    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("eventPage.title")}</h2>
                    <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                        {isCreateEvent() ? (
                            <Button
                                disabled={Boolean(loading)}
                                variant={"secondary"}
                                onClick={() => router.push(ROUTES.EVENTS_CREATE)}
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
            {/* <div className="flex flex-col sm:flex-row gap-2 justify-start items-end w-full md:w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full md:w-auto">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label
                            className="text-base"
                            htmlFor="taxcode"
                        >
                            {translation("label.taxCode")}
                        </Label>
                        <Input
                            disabled={Boolean(loading)}
                            id="taxcode"
                            type="text"
                            className="h-10 text"
                            placeholder={translation("placeholder.taxCode")}
                            onChange={handleSearchTaxcode}
                        />
                    </div>
                    <div className="grid w-full sm:max-w-xl items-center gap-1.5">
                        <Label
                            className="text-base"
                            htmlFor="name"
                        >
                            {translation("label.name")}
                        </Label>
                        <Input
                            disabled={Boolean(loading)}
                            id="name"
                            type="text"
                            className="h-10"
                            placeholder={translation("placeholder.name")}
                            onChange={handleSearchName}
                        />
                    </div>
                </div>
                <Button
                    disabled={Boolean(loading)}
                    onClick={handleClickSearch}
                >
                    {translation("action.search")}
                </Button>
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
            <FooterContainer />
        </>
    );
}
