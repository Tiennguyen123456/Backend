export interface ILogin {
	email: string;
	password: string;
}

export interface ILoginRes {
	id: number;
	username: string;
	name: string;
	email: string;
	type: string;
	gate: any;
	access_token: string;
	token_type: string;
}
