const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable eslint during build
  },
  images: {
    domains: [
      "raw.githubusercontent.com",
      "statics.gloryfinance.io",
      "s2.coinmarketcap.com",
      "tokens.pancakeswap.finance",
    ],
  },
  poweredByHeader: false,
  trailingSlash: false,
  basePath: "",
  transpilePackages: ["@pancakeswap/token-lists", "@pancakeswap/smart-router"],
  reactStrictMode: true, // React strict mode enabled

  webpack(config, { isServer }) {
    // Suppress Webpack warnings in development
    if (!isServer) {
      config.stats = {
        warnings: false, // Disable all Webpack warnings in the browser
      };
    }
    return config;
  },
}

module.exports = nextConfig
