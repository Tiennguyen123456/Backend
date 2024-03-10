import { IClientRes } from "./client-api";

export interface ILogSendEmailRes {
    id: number;
    campaign_id: number;
    client_id: number;
    email: string;
    subject: string;
    content: string;
    status: string;
    error: string;
    sent_at: string;
    created_at: string;
    updated_at: string;
    client: IClientRes | null;
}
