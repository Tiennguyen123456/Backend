import { IRoleRes } from "@/models/api/role-api";
import roleApi from "@/services/role-api";
import { useEffect, useState } from "react";

export function useFetchDataRole({ pagination: { page = 1, pageSize = 10 } = {} } = {}) {
    const [data, setData] = useState<IRoleRes[]>([]);
    const [pageCount, setPageCount] = useState<Number>(1);
    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);
        roleApi
            .getList({
                page,
                pageSize,
            })
            .then(function (response) {
                setData(response.data.collection);
                setPageCount(
                    Math.ceil(
                        response.data.pagination.meta.total / pageSize == 0
                            ? 1
                            : response.data.pagination.meta.total / pageSize,
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
    }, [pageSize, page, setData, setLoading]);

    return { data, loading, pageCount };
}
