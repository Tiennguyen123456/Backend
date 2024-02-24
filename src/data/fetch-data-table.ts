import { api } from "@/configs/axios.config";
import { useEffect, useState } from "react";
import { IListRes } from "@/models/DataTable";
import qs from "qs";

interface ParamsFetchDatatable {
    pagination: {
        page: number; // number page -> default page = 1
        limit: number; // limit record of page
    };
}

interface useFetchDataTableProps {
    url: string;
    params: ParamsFetchDatatable;
}

export function useFetchDataTable<IDataTableRes>({
    url,
    params: {
        pagination: { page = 1, limit = 10 },
    },
}: useFetchDataTableProps) {
    const [data, setData] = useState<IDataTableRes[]>([]);
    const [pageCount, setPageCount] = useState<Number>(1);
    const [loading, setLoading] = useState<Boolean>(false);
    const [reCall, setReCall] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);

        api.get<IResponse<IListRes<IDataTableRes>>>(url, {
            params: {
                page,
                pageSize: limit,
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
                        response.data.pagination.meta.total / limit == 0
                            ? 1
                            : response.data.pagination.meta.total / limit,
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
    }, [reCall, limit, page, setData, setLoading]);

    return { data, loading, pageCount, reCall, setReCall };
}
