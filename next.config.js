/** @type {import('next').NextConfig} */
const withNextIntl = require("next-intl/plugin")("./src/i18n-configurations/i18n-config.ts");
const storageDomain = process.env.NEXT_PUBLIC_DOMAIN_STORAGE;

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "delfi.com.vn",
                pathname: "**",
            },
            {
                protocol: "http",
                hostname: storageDomain,
                pathname: "**",
            },
        ],
    },
    reactStrictMode: false,
};

module.exports = withNextIntl(nextConfig);
