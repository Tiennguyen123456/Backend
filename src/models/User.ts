export interface IUserProfile {
    id: number;
    company_id: number;
    event_id: number;
    is_admin: boolean;
    expire_date: string;
    name: string;
    username: string;
    email: string;
    type: string;
    gate: any;
    avatar_path: string;
    note: any;
    status: string;
    created_by: string;
    updated_by: string;
    last_login_at: string;
    created_at: string;
    updated_at: string;
    roles: {
        [x: string]: string[];
    };
}
