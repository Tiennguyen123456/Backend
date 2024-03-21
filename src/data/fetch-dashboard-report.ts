import { IDashboardReportRes, IResFieldBasic } from "@/models/api/event-api";
import eventApi from "@/services/event-api";
import { useEffect, useState } from "react";

export function useFetchDashboardReport({ from = "", to = "" } = {}) {
    const [data, setData] = useState<IDashboardReportRes | null>(null);
    const [loading, setLoading] = useState<Boolean>(false);
    const [reCall, setReCall] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);
        eventApi
            .dashboardReport({ from, to })
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
    }, [reCall, setData, setLoading]);

    return { data, loading, reCall, setReCall };
}
