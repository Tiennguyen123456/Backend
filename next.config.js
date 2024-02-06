/** @type {import('next').NextConfig} */
const withNextIntl = require("next-intl/plugin")("./src/i18n-configurations/i18n-config.ts");

const nextConfig = {
    images: {
        domains: ["delfi.com.vn"],
    },
    reactStrictMode: false,
};

module.exports = withNextIntl(nextConfig);
