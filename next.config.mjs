// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    domains: ['i.postimg.cc', 'lh3.googleusercontent.com'],
  },
};

export default nextConfig;
