import { IRelationRes } from "./event-api";

export interface IPostRes {
    id: number;
    company_id: number;
    event_id: number;
    name: string;
    slug: string;
    title: string;
    subtitle: string;
    content: string;
    status: string;
    background_img: string;
    form_enable: number;
    form_title: string;
    form_content: string;
    form_input: string[];
    created_at: string;
    updated_at: string;
    company: IRelationRes | null;
    event: IRelationRes | null;
}
