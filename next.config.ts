import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      ...[
        ["kenya-lot-01", "plum-season"],
        ["burundi-lot-01", "honey-bloom"],
        ["ethiopia-lot-01", "jasmine-air"],
        ["ethiopia-lot-02", "blue-hour"],
        ["kiambu-washed-01", "plum-season"],
        ["kirinyaga-washed-02", "cane-light"],
        ["kayanza-washed-01", "honey-bloom"],
        ["kayanza-natural-02", "red-orchard"],
        ["sidama-washed-01", "jasmine-air"],
        ["guji-natural-02", "blue-hour"],
      ].map(([from, to]) => ({ source: `/shop/${from}`, destination: `/shop/${to}`, permanent: true })),
      { source: "/journal/canopy-and-landrace", destination: "/journal/beyond-heirloom", permanent: true },
    ];
  },
};

export default nextConfig;
