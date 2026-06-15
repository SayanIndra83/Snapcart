import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images:{
  remotePatterns:[
    {hostname:"lh3.googleusercontent.com"},
    {hostname: "plus.unsplash.com"}
  ]
}
};

export default nextConfig;
