"use client";

import { ColumnDef, OnChangeFn, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import React from "react";
import { Loader } from "./loader";
import { useTranslations } from "next-intl";

type PaginationState = {
    pageIndex: number;
    pageSize: number;
};

type RowSelectionState = Record<string, boolean>;

type ColumnSort = {
    id: string;
    desc: boolean;
};

type SortingState = ColumnSort[];

interface DataTableProps<TData extends { id: number }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    pageCount: number;
    rowSelection: RowSelectionState;
    onRowSelectionChange: OnChangeFn<RowSelectionState>;
    sorting: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
    loading: Boolean;
}

export function DataTable<TData extends { id: number }, TValue>({
    loading,
    columns,
    data,
    pagination,
    onPaginationChange,
    pageCount,
    onRowSelectionChange,
    rowSelection,
    sorting,
    onSortingChange,
}: DataTableProps<TData, TValue>) {
    // ** I18n
    const translation = useTranslations("datatable");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // Custom panigation
        manualPagination: true,
        onPaginationChange,
        pageCount,
        //Custom row selected
        onRowSelectionChange,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        getRowId: (row) => row.id.toString(),
        // Custom Sorting
        manualSorting: true,
        onSortingChange,
        // Custom state
        state: { pagination, rowSelection, sorting },
    });
    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-48 text-center"
                                >
                                    <Loader />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-48 text-center"
                                >
                                    {translation("noResults")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
