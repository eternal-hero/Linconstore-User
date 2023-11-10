
/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true
})

module.exports = withPWA({
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'enews.com.ng', 'cdn.pixabay.com', 'res.cloudinary.com', 'avatars.githubusercontent.com']
  },
  i18n: {
    locales: ['en', 'bg', 'hr', 'cs', 'da', 'nl', 'et', 'fi', 'fr', 'de', 'el', 'hu', 'ga-IE', 'it', 'lt', 'lb', 'mi-NZ', 'no', 'pl', 'pt', 'rm', 'es', 'sv', 'tr'],
    defaultLocale: 'en',
    localeDetection: true,
  }
});
