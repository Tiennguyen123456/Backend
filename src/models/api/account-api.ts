interface IRelationRes {
    id: number;
    name: string;
}
export interface IAccountRes {
    id: number;
    event_id: number;
    is_admin: boolean;
    expire_date: string;
    name: string;
    username: string;
    email: string;
    email_verified_at: string;
    type: string;
    gate: string;
    avatar_path: string;
    note: string;
    status: string;
    created_at: string;
    updated_at: string;
    last_login_at: string;
    company: IRelationRes | null;
    role: IRelationRes | null;
}
