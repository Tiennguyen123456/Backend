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
import { Checkbox } from "@/components/ui/checkbox";
import { CellAction } from "./components/cell-action";
import { CompanyColumn } from "./components/column";
import FooterContainer from "@/components/layout/footer-container";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { CompanyModal } from "./components/company-modal";
import { useFetchDataTable } from "@/data/fetch-data-table";
import ApiRoutes from "@/services/api.routes";
import { ICompanyRes } from "@/models/api/company-api";

export default function CompaniesPage() {
    // ** I18n
    const translation = useTranslations("");

    // ** State
    const [openModal, setOpenModal] = useState(false);
    const [rowSelected, setRowSelected] = useState<CompanyColumn | null>(null);

    // Use Date From To
    // const [dateFrom, setDateFrom] = useState<Date>();
    // const [dateTo, setDateTo] = useState<Date>();

    // Use Row Selection
    const { rowSelection, onRowSelection } = useRowSelection();
    // Use Pagination
    const { limit, onPaginationChange, skip, pagination, page } = usePagination();
    // Use Sorting
    const { sorting, onSortingChange, field, order } = useSorting();
    // Use fetch data
    const { data, loading, pageCount, refresh, setRefresh } = useFetchDataTable<ICompanyRes>({
        url: ApiRoutes.getCompanies,
        params: {
            pagination: { page, limit },
        },
    });

    // Function
    const handleAfterCreate = () => {
        setRefresh(!refresh);
    };

    const handleEditCompany = (data: CompanyColumn) => {
        setRowSelected({
            ...data,
            code: data.code ?? "",
            name: data.name ?? "",
            tax_code: data.tax_code ?? "",
            website: data.website ?? "",
            contact_email: data.contact_email ?? "",
            contact_phone: data.contact_phone ?? "",
            address: data.address ?? "",
            limited_users: data.limited_users ?? 0,
            limited_events: data.limited_events ?? 0,
            limited_campaigns: data.limited_campaigns ?? 0,
        });
        setOpenModal(true);
    };
    const handleCreateCompany = () => {
        setRowSelected(null);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setRowSelected(null);
        setOpenModal(false);
    };

    const columns: ColumnDef<CompanyColumn>[] = [
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
            header: () => <div className="text-black font-bold">{translation("companyPage.table.name")}</div>,
        },
        {
            accessorKey: "website",
            header: () => <div className="text-black font-bold">{translation("companyPage.table.website")}</div>,
        },
        {
            accessorKey: "contact_email",
            header: () => <div className="text-black font-bold">{translation("companyPage.table.email")}</div>,
        },
        {
            accessorKey: "address",
            header: () => <div className="text-black font-bold">{translation("companyPage.table.address")}</div>,
        },
        {
            accessorKey: "contact_phone",
            header: () => <div className="text-black font-bold">{translation("companyPage.table.phone")}</div>,
        },
        {
            accessorKey: "status",
            header: () => <div className="text-black font-bold">{translation("companyPage.table.status")}</div>,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <CellAction
                    onRowSelected={() => handleEditCompany(row.original)}
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
                    <h2 className="text-3xl font-bold tracking-tight">{translation("companyPage.title")}</h2>
                    <div className="flex justify-end flex-wrap items-center gap-2 !mt-0">
                        <CompanyModal
                            className="sm:max-w-[765px] overflow-y-auto max-h-svh md:max-h-[550px] 2xl:max-h-[800px]"
                            isOpen={openModal}
                            onClose={handleCloseModal}
                            defaultCompany={rowSelected}
                            onConfirm={handleAfterCreate}
                        />
                        <Button
                            variant={"secondary"}
                            onClick={handleCreateCompany}
                        >
                            <PlusCircle className="w-5 h-5 md:mr-2" />
                            <p className="hidden md:block">{translation("action.create")}</p>
                        </Button>
                        {/* <Button variant={"destructive"}>
                        <Trash2 className="w-5 h-5 md:mr-2" />
                        <p className="hidden md:block">{translation("action.delete")}</p>
                    </Button> */}
                    </div>
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
            <FooterContainer />
        </>
    );
}
