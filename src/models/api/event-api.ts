interface IMainFields {
    name: string;
    description: string;
}
export interface IEventRes {
    id: number;
    company_id: number;
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
    main_fields: IMainFields[];
    custom_fields: [];

    // email_content: null;
    // cards_content: null;
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
