"use client";
import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { DataTable } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/use-pagination";
import { useRowSelection } from "@/hooks/use-row-selection";
import { useSorting } from "@/hooks/use-sorting";
import { ColumnDef } from "@tanstack/react-table";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { useFetchDataTable } from "@/data/fetch-data-table";
import ApiRoutes from "@/services/api.routes";
import { DateTimeFormat, emailRegExp } from "@/constants/variables";
import { EStatus } from "@/constants/enum";
import { LogSendEmailColumn } from "./components/column";
import { ILogSendEmailRes } from "@/models/api/log-send-email-api";
import { format } from "date-fns";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/utils/toast";

export default function LogSendEmailPage({ params }: { params: { id: number } }) {
    // ** I18n
    const translation = useTranslations("");
    // Use Ref
    const InputEmailSearchRef = useRef<HTMLInputElement>(null);

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
    const { data, loading, pageCount, refresh, setRefresh } = useFetchDataTable<ILogSendEmailRes>({
        url: ApiRoutes.getLogSendEmailByCampaignId.replace("$campaignId", params?.id.toString()),
        paramsDataTable: {
            ...paramsDataTable,
            pagination: {
                page: page ?? 1,
                pageSize: limit ?? 1,
            },
        },
    });

    // Function
    const handleSearchEmail = (event: any) => {
        setParamsSearch({ ...paramsSearch, search: { ...paramsSearch.search, email: event.target.value } });
    };
    const handleSearchStatus = (statusName: any) => {
        setParamsSearch(
            statusName == EStatus.ALL
                ? {
                      ...paramsSearch,
                      filters: { ...paramsSearch.filters, status: "" },
                  }
                : { ...paramsSearch, filters: { ...paramsSearch.filters, status: statusName } },
        );
    };
    const handleClickSearch = () => {
        let email = InputEmailSearchRef.current?.value.trim() ?? "";
        if (!emailRegExp.test(email)) {
            toastError(translation("error.invalidEmail"));
            return false;
        }
        setParamsDataTable({ ...paramsDataTable, search: paramsSearch.search, filters: paramsSearch.filters });
    };

    const columns: ColumnDef<LogSendEmailColumn>[] = [
        {
            accessorKey: "client.fullname",
            header: () => <div className="text-black font-bold">{translation("logSendEmailPage.table.client")}</div>,
        },
        {
            accessorKey: "email",
            header: () => <div className="text-black font-bold">{translation("logSendEmailPage.table.email")}</div>,
        },
        {
            accessorKey: "status",
            header: () => <div className="text-black font-bold">{translation("logSendEmailPage.table.status")}</div>,
            cell: ({ row }) => (
                <BadgeStatus status={row.original.status}>{translation(`status.${row.original.status}`)}</BadgeStatus>
            ),
        },
        {
            accessorKey: "sent_at",
            header: () => <div className="text-black font-bold">{translation("logSendEmailPage.table.sentAt")}</div>,
            cell: ({ row }) => format(row.original.sent_at, DateTimeFormat),
        },
    ];

    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("logSendEmailPage.title")}</h2>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-start items-end w-full md:w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 w-full md:w-auto">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label
                            className="text-base"
                            htmlFor="email"
                        >
                            {translation("label.email")}
                        </Label>
                        <Input
                            ref={InputEmailSearchRef}
                            disabled={Boolean(loading)}
                            id="email"
                            type="text"
                            className="h-10 text"
                            onChange={handleSearchEmail}
                        />
                    </div>
                    {/* <div className="grid w-full sm:max-w-xl items-center gap-1.5">
                        <Label
                            className="text-base"
                            htmlFor="name"
                        >
                            {translation("label.eventName")}
                        </Label>
                        <Input
                            disabled={Boolean(loading)}
                            id="name"
                            type="text"
                            className="h-10"
                            placeholder={translation("placeholder.eventName")}
                            onChange={handleSearchName}
                        />
                    </div>
                    <div className="grid w-full sm:max-w-xl items-center gap-1.5">
                        <Label className="text-base">{translation("label.status")}</Label>
                        <Select
                            disabled={Boolean(loading)}
                            onValueChange={handleSearchStatus}
                            defaultValue={EStatus.ALL}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={translation("placeholder.status")} />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_FILTER_CAMPAIGN.map((status) => (
                                    <SelectItem
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {translation(`status.${status.value}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div> */}
                </div>
                <Button
                    disabled={Boolean(loading)}
                    onClick={handleClickSearch}
                >
                    {translation("action.search")}
                </Button>
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
