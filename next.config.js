/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https", // Specify the protocol
        hostname: "rjdaiznqbwaebuqsjjzz.supabase.co", // Your Supabase hostname
        port: "", // Leave empty if no specific port is required (default for https)
        pathname: "/storage/v1/object/public/**", // Allow any path under public storage
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**", // Allow any path from placehold.co
      },
    ],
  },
};

module.exports = nextConfig;
