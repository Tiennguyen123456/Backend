import { IAccountRes } from "@/models/api/account-api";

export interface AccountColumn extends IAccountRes {
    company_id: number;
    company_name: string;
    role_id: number;
    role_name: string;
    password: string;
}
