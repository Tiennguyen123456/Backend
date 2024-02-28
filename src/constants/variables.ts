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

export const DateTimeFormat = "dd-MM-y HH:mm:ss";
export const DateFormat = "dd-MM-y";
export const DateFormatServer = "y-MM-dd";
export const DateTimeFormatServer = "y-MM-dd HH:mm:ss";

export const STATUS_VALID = [
    { label: "New", value: "NEW" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];
export const STATUS = [...STATUS_VALID, { label: "Done", value: "DONE" }, { label: "Cancel", value: "CANCEL" }];
// { label: "Deleted", value: "DELETED" }
