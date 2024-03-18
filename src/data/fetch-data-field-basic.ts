import { IResFieldBasic } from "@/models/api/event-api";
import eventApi from "@/services/event-api";
import { useEffect, useState } from "react";

export function useFetchDataFieldBasic({ pagination: { page = 1, pageSize = 10 } = {} } = {}) {
    const [data, setData] = useState<IResFieldBasic | null>(null);
    const [pageCount, setPageCount] = useState<Number>(1);
    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);
        eventApi.getFieldBasic()
            .then(function (response) {
                setData(response.data);
            })
            .catch(function (error) {
                console.log(error);
                setData(null);
            })
            .finally(function () {
                setLoading(false);
            });
    }, [pageSize, page, setData, setLoading]);

    return { data, loading, pageCount };
}
