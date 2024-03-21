import { IDashboardReportRes, IResFieldBasic } from "@/models/api/event-api";
import eventApi from "@/services/event-api";
import { useEffect, useState } from "react";

export function useFetchDashboardReport(params = {}) {
    const [data, setData] = useState<IDashboardReportRes | null>(null);
    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);
        eventApi
            .dashboardReport(params)
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
    }, [params, setData, setLoading]);

    return { data, loading };
}
