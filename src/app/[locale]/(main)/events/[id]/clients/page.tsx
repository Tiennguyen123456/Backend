"use client";
import { Button } from "@/components/ui/button";
import React, { ChangeEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Import, PlusCircle, Trash2 } from "lucide-react";
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
import { ICompanyRes } from "@/models/api/company-api";
import { isActionsPermissions } from "@/helpers/funcs";
import { useAppSelector } from "@/redux/root/hooks";
import { selectUser } from "@/redux/user/slice";
import { ActionPermissions } from "@/constants/routes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APIStatus, EStatus, MessageCode } from "@/constants/enum";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_VALID_FILTER } from "@/constants/variables";
import { Checkbox } from "@/components/ui/checkbox";
import { IClientRes } from "@/models/api/client-api";
import { toastError, toastSuccess } from "@/utils/toast";
import { AxiosRequestConfig } from "axios";
import companyApi from "@/services/company-api";
import clientApi from "@/services/client-api";

export default function EventClientPage({ params }: { params: { id: number } }) {
    // ** I18n
    const translation = useTranslations("");

    // ** User Selector
    const { userPermissions } = useAppSelector(selectUser);
    // Use Ref
    const InputFileRef = useRef<HTMLInputElement>(null);

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
    const { data, loading, pageCount, refresh, setRefresh } = useFetchDataTable<IClientRes>({
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
    const handleEditCompany = (data: ClientColumn) => {
        // setRowSelected({
        //     ...data,
        //     code: data.code ?? "",
        //     name: data.name ?? "",
        //     tax_code: data.tax_code ?? "",
        //     website: data.website ?? "",
        //     contact_email: data.contact_email ?? "",
        //     contact_phone: data.contact_phone ?? "",
        //     address: data.address ?? "",
        //     limited_users: data.limited_users ?? 0,
        //     limited_events: data.limited_events ?? 0,
        //     limited_campaigns: data.limited_campaigns ?? 0,
        // });
        // setOpenModal(true);
    };
    const handleCreateCompany = () => {
        setRowSelected(null);
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setRowSelected(null);
        setOpenModal(false);
    };
    const canCreateCompany = isActionsPermissions(userPermissions, ActionPermissions.CREATE_COMPANY);
    const canUpdateCompany = isActionsPermissions(userPermissions, ActionPermissions.UPDATE_COMPANY);
    const canDeleteCompany = isActionsPermissions(userPermissions, ActionPermissions.DELETE_COMPANY);
    const handleSearchTaxCode = (event: any) => {
        setParamsSearch({ ...paramsSearch, filters: { ...paramsSearch.filters, tax_code: event.target.value } });
    };
    const handleSearchName = (event: any) => {
        setParamsSearch({ ...paramsSearch, search: { ...paramsSearch.search, name: event.target.value } });
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
        setParamsDataTable({ ...paramsDataTable, search: paramsSearch.search, filters: paramsSearch.filters });
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
            header: () => <div className="text-black font-bold">{translation("clientsPage.table.name")}</div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-black font-bold">{translation("clientsPage.table.phone")}</div>,
        },
        {
            accessorKey: "email",
            header: () => <div className="text-black font-bold">{translation("clientsPage.table.email")}</div>,
        },
        {
            accessorKey: "address",
            header: () => <div className="text-black font-bold">{translation("clientsPage.table.address")}</div>,
        },
        {
            accessorKey: "type",
            header: () => <div className="text-black font-bold">{translation("clientsPage.table.type")}</div>,
        },
        {
            accessorKey: "status",
            header: () => <div className="text-black font-bold">{translation("clientsPage.table.status")}</div>,
            cell: ({ row }) => translation(`status.${row.original.status}`),
        },
        {
            id: "actions",
            header: () => <div className="text-black font-bold">{translation("datatable.action")}</div>,
            cell: ({ row }) =>
                canUpdateCompany || canDeleteCompany ? (
                    <CellAction
                        onRowSelected={() => handleEditCompany(row.original)}
                        onRefetch={handleOnRefreshDataTable}
                        data={row.original}
                        isUpdate={canUpdateCompany}
                        isDelete={canDeleteCompany}
                    />
                ) : (
                    ""
                ),
        },
    ];
    const handleImportFile = () => {
        InputFileRef.current?.click();
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
                toastSuccess(messageSuccess);
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
    return (
        <>
            <div className="w-full space-y-4">
                <Breadcrumbs />
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">{translation("clientsPage.title")}</h2>
                    <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                        {/* <ClientModal
                            className="sm:max-w-[976px] overflow-y-auto max-h-svh md:max-h-[550px] 2xl:max-h-[780px]"
                            isOpen={openModal}
                            onClose={handleCloseModal}
                            defaultData={rowSelected}
                            onConfirm={handleOnRefreshDataTable}
                        /> */}
                        <Button
                            disabled={loadingPage}
                            variant={"secondary"}
                            onClick={handleImportFile}
                        >
                            <Import className="w-5 h-5 md:mr-2" />
                            <p className="hidden md:block">{translation("action.importExcel")}</p>
                        </Button>
                        <Input
                            ref={InputFileRef}
                            className="hidden"
                            type="file"
                            onChange={handleFileChange}
                        />
                        {/* {canCreateCompany && (
                            <Button
                                disabled={Boolean(loading)}
                                variant={"secondary"}
                                onClick={handleCreateCompany}
                            >
                                <PlusCircle className="w-5 h-5 md:mr-2" />
                                <p className="hidden md:block">{translation("action.create")}</p>
                            </Button>
                        )} */}
                    </div>
                </div>
            </div>
            {/* <div className="flex flex-col sm:flex-row gap-2 justify-start items-end w-full md:w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
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
                            onChange={handleSearchTaxCode}
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
                                {STATUS_VALID_FILTER.map((status) => (
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
