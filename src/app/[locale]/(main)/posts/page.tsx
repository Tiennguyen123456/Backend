"use client";
import { Button } from "@/components/ui/button";
import React, { ChangeEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, FileDown, Import, PlusCircle } from "lucide-react";
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
import { APIStatus, EStatus, MessageCode } from "@/constants/enum";
import { Checkbox } from "@/components/ui/checkbox";
import { toastError, toastLoading, toastSuccess } from "@/utils/toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_FILTER_CLIENT_CHECK_IN, emailRegExp } from "@/constants/variables";
import { useRouter } from "next/navigation";
import { IPostRes } from "@/models/api/post-api";
import { PostColumn } from "./components/column";

export default function LandingPagePage() {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    // ** User Selector
    const { userPermissions } = useAppSelector(selectUser);
    // Use Ref
    const InputEmailSearchRef = useRef<HTMLInputElement>(null);

    // Use Row Selection
    const { rowSelection, onRowSelection } = useRowSelection();
    // Use Pagination
    const { limit, onPaginationChange, skip, pagination, page } = usePagination();
    // Use Sorting
    const { sorting, onSortingChange, field, order } = useSorting();

    // ** State
    const [loadingPage, setLoadingPage] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [rowSelected, setRowSelected] = useState<PostColumn | null>(null);
    const [paramsSearch, setParamsSearch] = useState({
        search: {},
        filters: {},
    });
    const [paramsDataTable, setParamsDataTable] = useState({
        search: {},
        filters: {},
    });

    // Use fetch data
    const { data, loading, pageCount, refresh, setRefresh } = useFetchDataTable<IPostRes>({
        url: ApiRoutes.getPosts,
        paramsDataTable: {
            ...paramsDataTable,
            pagination: {
                page: page ?? 1,
                pageSize: limit ?? 1,
            },
        },
    });

    // Function
    const handleOnRefreshDataTable = () => {
        setRefresh(!refresh);
    };
    const handleCloseModal = () => {
        setRowSelected(null);
        setOpenModal(false);
    };
    const canCreatePost = isActionsPermissions(userPermissions, ActionPermissions.CREATE_POST);
    const canUpdatePost = isActionsPermissions(userPermissions, ActionPermissions.UPDATE_POST);
    const canDeletePost = isActionsPermissions(userPermissions, ActionPermissions.DELETE_POST);
    const handleSearchEmail = (event: any) => {
        setParamsSearch({ ...paramsSearch, search: { ...paramsSearch.search, email: event.target.value } });
    };
    const handleSearchPhone = (event: any) => {
        setParamsSearch({ ...paramsSearch, search: { ...paramsSearch.search, phone: event.target.value } });
    };
    const handleSearchStatus = (statusName: any) => {
        setParamsSearch(
            statusName == EStatus.ALL
                ? {
                      ...paramsSearch,
                      filters: { ...paramsSearch.filters, is_checkin: "" },
                  }
                : {
                      ...paramsSearch,
                      filters: { ...paramsSearch.filters, is_checkin: statusName == EStatus.CHECKIN ? 1 : 0 },
                  },
        );
    };
    const handleClickSearch = () => {
        let email = InputEmailSearchRef.current?.value.trim() ?? "";
        if (!emailRegExp.test(email) && email.length > 0) {
            toastError(translation("error.invalidEmail"));
            return false;
        }
        setParamsDataTable({ ...paramsDataTable, search: paramsSearch.search, filters: paramsSearch.filters });
    };
    const columns: ColumnDef<PostColumn>[] = [
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
            accessorKey: "fullname",
            header: () => <div className="text-black font-bold">{translation("postPage.table.title")}</div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-black font-bold">{translation("postPage.table.subtitle")}</div>,
        },
        {
            accessorKey: "status",
            header: () => <div className="text-black font-bold">{translation("postPage.table.status")}</div>,
            cell: ({ row }) => (
                <BadgeStatus status={row.original.status}>{translation(`status.${row.original.status}`)}</BadgeStatus>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-black font-bold">{translation("datatable.action")}</div>,
            cell: ({ row }) =>
                canUpdatePost || canDeletePost ? (
                    <CellAction
                        onRowSelected={() => router.push(ROUTES.POSTS + `/${row.original.id}`)}
                        onRefetch={handleOnRefreshDataTable}
                        data={row.original}
                        isUpdate={canUpdatePost}
                        isDelete={canDeletePost}
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
                    <h2 className="text-3xl font-bold tracking-tight">{translation("postPage.title")}</h2>
                    <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                        {canCreatePost && (
                            <Button
                                disabled={Boolean(loading)}
                                variant={"secondary"}
                                onClick={() => router.push(ROUTES.POSTS_CREATE)}
                            >
                                <PlusCircle className="w-5 h-5 md:mr-2" />
                                <p className="hidden md:block">{translation("action.create")}</p>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {/* <div className="flex flex-col sm:flex-row gap-2 justify-start items-end w-full md:w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
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
                    <div className="grid w-full sm:max-w-xl items-center gap-1.5">
                        <Label
                            className="text-base"
                            htmlFor="phone"
                        >
                            {translation("label.phone")}
                        </Label>
                        <Input
                            disabled={Boolean(loading)}
                            id="name"
                            type="text"
                            className="h-10"
                            onChange={handleSearchPhone}
                        />
                    </div>
                    <div className="grid w-full sm:max-w-xl items-center gap-1.5">
                        <Label className="text-base">{translation("label.checkIn")}</Label>
                        <Select
                            disabled={Boolean(loading)}
                            onValueChange={handleSearchStatus}
                            defaultValue={EStatus.ALL}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={translation("placeholder.status")} />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_FILTER_CLIENT_CHECK_IN.map((status) => (
                                    <SelectItem
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {translation(`status.${status.value}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
