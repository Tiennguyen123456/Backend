export interface ICompanyRes {
    id: number;
    parent_id: number;
    is_default: boolean;
    name: string;
    code: string;
    contact_email: string;
    contact_phone: string;
    website: string;
    address: string;
    city: string;
    limited_users: number;
    limited_events: number;
    limited_campaigns: number;
    status: string;
    created_at: string;
    updated_at: string;
}
