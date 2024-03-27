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
import { ClientColumn } from "./components/column";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { ClientModal } from "./components/client-modal";
import { useFetchDataTable } from "@/data/fetch-data-table";
import ApiRoutes from "@/services/api.routes";
import { isActionsPermissions } from "@/helpers/funcs";
import { useAppSelector } from "@/redux/root/hooks";
import { selectUser } from "@/redux/user/slice";
import { ActionPermissions, ROUTES } from "@/constants/routes";
import { Input } from "@/components/ui/input";
import { APIStatus, EStatus, MessageCode } from "@/constants/enum";
import { Checkbox } from "@/components/ui/checkbox";
import { IClientRes } from "@/models/api/client-api";
import { toastError, toastLoading, toastSuccess } from "@/utils/toast";
import clientApi from "@/services/client-api";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_FILTER_CLIENT_CHECK_IN, emailRegExp } from "@/constants/variables";
import { useRouter } from "next/navigation";

export default function LandingPagePage({ params }: { params: { id: number } }) {
    // ** I18n
    const translation = useTranslations("");

    // ** Router
    const router = useRouter();

    // ** User Selector
    const { userPermissions } = useAppSelector(selectUser);
    // Use Ref
    const InputFileRef = useRef<HTMLInputElement>(null);
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
    const [rowSelected, setRowSelected] = useState<ClientColumn | null>(null);
    const [paramsSearch, setParamsSearch] = useState({
        search: {},
        filters: {},
    });
    const [paramsDataTable, setParamsDataTable] = useState({
        search: {},
        filters: {},
    });

    // Use fetch data
    const { data, loading, pageCount, refresh, setRefresh, totalClient, totalCheckIn } = useFetchDataTable<IClientRes>({
        url: ApiRoutes.getClientsByEvent + `/${params.id}/clients`,
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
    const handleEditClient = (data: ClientColumn) => {
        setRowSelected({
            ...data,
            fullname: data.fullname ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            address: data.address ?? "",
            group: data.group ?? "",
            type: data.type ?? "",
            status: data.status ?? "",
        });
        setOpenModal(true);
    };
    const handleCreateLandingPage = () => {
        
    };
    const handleCloseModal = () => {
        setRowSelected(null);
        setOpenModal(false);
    };
    const canImportClient = isActionsPermissions(userPermissions, ActionPermissions.IMPORT_CLIENT);
    const canCheckInClient = isActionsPermissions(userPermissions, ActionPermissions.CHECK_IN_CLIENT);
    const canCreateClient = isActionsPermissions(userPermissions, ActionPermissions.CREATE_CLIENT);
    const canUpdateClient = isActionsPermissions(userPermissions, ActionPermissions.UPDATE_CLIENT);
    const canDeleteClient = isActionsPermissions(userPermissions, ActionPermissions.DELETE_CLIENT);
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
    const handleImportFile = () => {
        InputFileRef.current?.click();
    };
    const handleDownloadFileSample = async () => {
        try {
            setLoadingPage(true);
            const response = await clientApi.downloadSampleExcel();
            var blob = new Blob([response.data as unknown as Blob]);
            var url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Sample_Import_Client.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            const data = error?.response?.data;
            if (data?.data && data?.message_code == MessageCode.VALIDATION_ERROR) {
                const [value] = Object.values(data.data);
                const message = Array(value).toString() ?? translation("errorApi.UNKNOWN_ERROR");
                toastError(message);
            } else if (data?.message_code != MessageCode.VALIDATION_ERROR) {
                toastError(translation(`errorApi.${data?.message_code}`));
            } else {
                toastError(translation("errorApi.UNKNOWN_ERROR"));
            }
            console.log("error: ", error);
        } finally {
            setLoadingPage(false);
        }
    };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target;

        if (!fileInput.files) {
            toastError("No file was chosen");
            return;
        }
        console.log(fileInput);

        if (!fileInput.files || fileInput.files.length === 0) {
            toastError("Files list is empty");
            return;
        }

        const file = fileInput.files[0];
        handleUploadFile(file);
    };
    const handleUploadFile = async (file: File) => {
        const messageSuccess = translation("successApi.IMPORT_EXCEL_CLIENT_SUCCESS");
        const messageError = translation("errorApi.IMPORT_EXCEL_CLIENT_FAILED");
        try {
            setLoadingPage(true);
            let formData = new FormData();
            formData.append("file", file);

            const response = await clientApi.importExcelClient(params.id, formData);

            if (response.data.status == APIStatus.SUCCESS) {
                toastLoading(messageSuccess);
                handleOnRefreshDataTable();
            }
        } catch (error: any) {
            const data = error?.response?.data;
            if (data?.data && data?.message_code == MessageCode.VALIDATION_ERROR) {
                const [value] = Object.values(data.data);
                const message = Array(value).toString() ?? messageError;
                toastError(message);
            } else if (data?.message_code != MessageCode.VALIDATION_ERROR) {
                toastError(translation(`errorApi.${data?.message_code}`));
            } else {
                toastError(messageError);
            }
            console.log("error: ", error);
        } finally {
            setLoadingPage(false);
        }
    };
    const columns: ColumnDef<ClientColumn>[] = [
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
            header: () => <div className="text-black font-bold">{translation("landingPage.table.title")}</div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-black font-bold">{translation("landingPage.table.subtitle")}</div>,
        },
        {
            accessorKey: "status",
            header: () => <div className="text-black font-bold">{translation("landingPage.table.status")}</div>,
            cell: ({ row }) => (
                <BadgeStatus status={row.original.status}>{translation(`status.${row.original.status}`)}</BadgeStatus>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-black font-bold">{translation("datatable.action")}</div>,
            cell: ({ row }) =>
                canUpdateClient || canDeleteClient || canCheckInClient ? (
                    <CellAction
                        onRowSelected={() => handleEditClient(row.original)}
                        onRefetch={handleOnRefreshDataTable}
                        data={row.original}
                        eventId={params.id}
                        isUpdate={canUpdateClient}
                        isDelete={canDeleteClient}
                        isCheckIn={canCheckInClient}
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
                    <h2 className="text-3xl font-bold tracking-tight">{translation("landingPage.title")}</h2>
                    <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                        <ClientModal
                            className="sm:max-w-[976px] overflow-y-auto max-h-svh md:max-h-[550px] 2xl:max-h-[780px]"
                            isOpen={openModal}
                            onClose={handleCloseModal}
                            defaultData={rowSelected}
                            onConfirm={handleOnRefreshDataTable}
                            eventId={params.id}
                            isUpdate={canUpdateClient}
                        />
                        {canCreateClient && (
                            <Button
                                disabled={Boolean(loading)}
                                variant={"secondary"}
                                onClick={() => router.push(ROUTES.EVENTS + `/${params.id}/landing-pages/create`)}
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
