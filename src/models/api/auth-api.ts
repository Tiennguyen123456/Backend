export interface ILoginReq {
    email: string;
    password: string;
}

export interface ILoginRes {
    id: number;
    username: string;
    name: string;
    email: string;
    type: string;
    access_token: string;
    token_type: string;
}

export interface IResetPasswordReq {
    email: string;
}