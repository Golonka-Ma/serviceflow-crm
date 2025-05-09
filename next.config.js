/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for finding potential problems
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**", // Allow any path starting with /a/ which is common for Google avatars
      },
      // Add other hostnames if needed, e.g., for Supabase storage
      {
        protocol: "https",
        hostname: "*.supabase.co", // Allow any Supabase storage hostname
      },
    ],
  },
};

module.exports = nextConfig;
