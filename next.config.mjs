/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/render/*': ['./site-content/**/*'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/render/index' },
        ...['about', 'treatments', 'concerns', 'privacy-policy', 'terms-of-use'].map((slug) => ({ source: `/${slug}`, destination: `/render/${slug}` })),
      ],
      fallback: [{ source: '/_next/static/:path*', destination: '/site-assets/next/:path*' }],
    }
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
    ] }]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
