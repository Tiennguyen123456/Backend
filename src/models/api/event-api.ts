interface IMainFields {
    name: string;
    description: string;
    value: string;
}
export interface ICustomFields extends IMainFields {
    id: number;
}
export interface IRelationRes {
    id: number;
    name: string;
}
export interface ITagsList {
    title: string;
    value: string;
}
export interface IResFieldBasic {
    [x: string]: string;
}
export interface IEventRes {
    id: number;
    company: IRelationRes | null;
    code: string;
    name: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    status: string;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    email_content: string;
    cards_content: string;
    main_fields: IMainFields[];
    custom_fields: ICustomFields[];

    // is_default: boolean;
    // logo_path: string;
    // encrypt_file_link: boolean;
    // main_field_templates: string;
    // custom_field_templates: string;
    // languages: string;
    // contact_name: string;
    // contact_email: string;
    // contact_phone: string;
}

export interface IDashboardReportRes {
    status: {
        TOTAL: number;
        ACTIVE: number;
        INACTIVE: number;
    };
    count_by_date: {
        [x: string]: string;
    };
}
