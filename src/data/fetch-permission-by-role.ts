import { ICollectionRoleRes } from "@/models/api/permission-api";
import permissionApi from "@/services/permission-api";
import { useEffect, useState } from "react";

export function useFetchPermissionByRoleId(id: number) {
    const [data, setData] = useState<ICollectionRoleRes[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);
        permissionApi
            .getPermissionByRoleId(id)
            .then(function (response) {
                setData(response.data.collection);
            })
            .catch(function (error) {
                console.log(error);
                setData([]);
            })
            .finally(function () {
                setLoading(false);
            });
    }, [id]);

    return { data, loading };
}
