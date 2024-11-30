/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
};

const withNextIntl = require('next-intl/plugin')(
  './app/i18n.ts'
);

module.exports = withNextIntl(nextConfig);