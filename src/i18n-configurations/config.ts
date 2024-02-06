import { Pathnames } from "next-intl/navigation";

// Can be imported from a shared config
export const locales = ["en", "vi"];

export const pathnames = {
	"/": "/",
	"/pathnames": {
		en: "/pathnames",
		vi: "/pathnames",
	},
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
