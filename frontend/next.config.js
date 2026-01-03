const removeImports = require("next-remove-imports")();
module.exports = removeImports({
  experimental: { esmExternals: true },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone',
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://0.0.0.0:8000/api/:path*"
            : process.env.NEXT_PUBLIC_BACKEND_URL 
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`
              : "http://backend:80/:path*",
      },
    ];
  },
};

const buildConfig = (_phase) => {
  const plugins = [];
  const config = plugins.reduce((acc, next) => next(acc), {
    ...nextConfig,
  });
  return config;
};

module.exports = buildConfig();
