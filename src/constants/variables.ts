export const ScreenWidth = {
    sm: 480,
    md: 768,
    lg: 976,
    xl: 1024,
    xxl: 1440,
};

export const arrNumberRowInPage = [10, 20, 30, 40, 50];

export const phoneRegExp = new RegExp(
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
);
export const emailRegExp = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);

export const specialCharacterRegExp = new RegExp(/[\!\@\#\$\%\^\&\*\)\/(\+\=\.\,\?\<\>\{\}\[\]\\:\;\'\"\|\~\`\_\-]/g);

export const replaceIdInURLRegExp = new RegExp(/\/\d+/);

export const DateTimeFormat = "dd-MM-y HH:mm:ss";
export const DateFormat = "dd-MM-y";
export const DateFormatServer = "y-MM-dd";
export const DateTimeFormatServer = "y-MM-dd HH:mm:ss";

export const STATUS_VALID = [
    { label: "New", value: "NEW" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

export const COMPANY_STATUS = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

export const STATUS_FILTER_COMPANY = [
    { label: "All status", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

export const ACCOUNT_STATUS = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

export const STATUS_FILTER_ACCOUNT = [
    { label: "All status", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

export const EVENT_STATUS = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

export const STATUS = [...STATUS_VALID, { label: "Done", value: "DONE" }, { label: "Cancel", value: "CANCEL" }];

export const STATUS_FILTER_EVENT = [
    { label: "All status", value: "ALL" },
    ...STATUS_VALID,
    { label: "Done", value: "DONE" },
    { label: "Cancel", value: "CANCEL" },
];

export const CAMPAIGN_STATUS = [
    { label: "New", value: "NEW" },
    { label: "Running", value: "RUNNING" },
    { label: "Paused", value: "PAUSED" },
    { label: "Stopped", value: "STOPPED" },
    { label: "Finished", value: "FINISHED" },
];
export const CLIENT_CHECK_IN_STATUS = [
    { label: "CheckIn", value: "CHECKIN" },
    { label: "UnCheckIn", value: "UNCHECKIN" },
];
export const SCAN_QR_CODE_CAMERA = [
    { id: "environment", label: "Environment Camera (Default)" },
    // { id: "user", label: "User Camera" },
];
export const STATUS_FILTER_CAMPAIGN = [{ label: "All status", value: "ALL" }, ...CAMPAIGN_STATUS];
export const STATUS_FILTER_CLIENT_CHECK_IN = [{ label: "All", value: "ALL" }, ...CLIENT_CHECK_IN_STATUS];
