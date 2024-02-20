import { ICompanyRes } from "./../models/api/company-api";
import companyApi from "@/services/company-api";
import { useEffect, useState } from "react";

export function useFetchDataCompany({ pagination: { page = 1, perPage = 10 } = {} } = {}) {
    const [data, setData] = useState<ICompanyRes[]>([]);
    const [pageCount, setPageCount] = useState<Number>(1);
    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);
        companyApi
            .getCompanies({
                page,
                perPage,
            })
            .then(function (response) {
                setData(response.data.collection);
                setPageCount(
                    Math.round(
                        response.data.pagination.meta.total / perPage == 0
                            ? 1
                            : response.data.pagination.meta.total / perPage,
                    ),
                );
            })
            .catch(function (error) {
                console.log(error);
                setData([]);
                setPageCount(1);
            })
            .finally(function () {
                setLoading(false);
            });
    }, [perPage, page, setData, setLoading]);

    return { data, loading, pageCount };
}
