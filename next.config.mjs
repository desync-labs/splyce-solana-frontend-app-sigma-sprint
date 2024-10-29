/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/prod-rpc-helius",
        destination: `https://mainnet.helius-rpc.com/?api-key=${process.env.PROD_RPC_KEY_HELIUM}`,
      },
    ];
  },
};

export default nextConfig;
