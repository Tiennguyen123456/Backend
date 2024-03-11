import { IRelationRes } from "./event-api";

export interface ICampaignRes {
    id: number;
    name: string;
    company_id: number;
    event_id: number;
    run_time: string;
    filter_client: any;
    status: string;
    mail_content: string;
    mail_subject: string;
    sender_email: string;
    sender_name: string;
    description: string;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    company: IRelationRes | null;
    event: IRelationRes | null;
}
