import { EventConfigFieldType, EventConfigTemplateType } from "../Event";

export interface IEventRes {
  id: number;
  company_id: number;
  is_default: boolean;
  code: string;
  name: string;
  description: string;
  logo_path: string;
  location: string;
  encrypt_file_link: boolean;
  from_date: string;
  end_date: string;
  main_field_templates: string;
  custom_field_templates: string;
  languages: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  note: string;
  status: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface IEventConfigFieldsRes {
  id: number;
  template: EventConfigTemplateType;
  main_fields: {
    [x: string]: EventConfigFieldType;
  };
  custom_fields: {
    [x: string]: EventConfigFieldType;
  };
}

export interface IUpdateEventConfigFields {
  event_id: number;
  data: {
    main_fields: {
      [x: string]: EventConfigFieldType;
    };
    custom_fields: {
      [x: string]: EventConfigFieldType;
    };
  };
}

export interface IDeleteEventConfigFields {
  event_id: number;
  data: {
    custom_fields: string[];
  };
}
