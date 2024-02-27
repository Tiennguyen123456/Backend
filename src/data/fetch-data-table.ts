import { api } from "@/configs/axios.config";
import { useEffect, useState } from "react";
import { IParamsDataTable, IListRes } from "@/models/DataTable";
import qs from "qs";
import DataTableConfig from "@/configs/DataTableConfig";

interface useFetchDataTableProps {
    url: string;
    paramsDataTable: IParamsDataTable;
}

export function useFetchDataTable<IDataTableRes>({
    url,
    paramsDataTable: { search, filters, pagination = { page: 1, pageSize: DataTableConfig.pageSize } },
}: useFetchDataTableProps) {
    const [data, setData] = useState<IDataTableRes[]>([]);
    const [pageCount, setPageCount] = useState<Number>(1);
    const [loading, setLoading] = useState<Boolean>(false);
    const [refresh, setRefresh] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);

        api.get<IResponse<IListRes<IDataTableRes>>>(url, {
            params: {
                page: pagination.page,
                pageSize: pagination.pageSize,
                search,
                filters,
            },
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: "brackets" });
            },
        })
            .then((response) => response.data)
            .then((response) => {
                setData(response.data.collection);
                setPageCount(
                    Math.ceil(
                        response.data.pagination.meta.total / pagination.pageSize == 0
                            ? 1
                            : response.data.pagination.meta.total / pagination.pageSize,
                    ),
                );
            })
            .catch(function (error) {
                console.log(error);
                setData([]);
                setPageCount(0);
            })
            .finally(function () {
                setLoading(false);
            });
    }, [refresh, pagination.page, pagination.pageSize, search, filters, url, setData, setLoading]);

    return { data, loading, pageCount, refresh, setRefresh };
}
