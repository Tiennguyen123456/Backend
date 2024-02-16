import DataTableConfig from "@/configs/DataTableConfig";
import { useState } from "react";

export function usePagination() {
    const [pagination, setPagination] = useState({
        pageSize: DataTableConfig.pageSize,
        pageIndex: 0,
    });
    const { pageSize, pageIndex } = pagination;

    return {
        limit: pageSize,
        onPaginationChange: setPagination,
        pagination,
        skip: pageSize * pageIndex,
    };
}
