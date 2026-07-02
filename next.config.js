const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.googleapis.com" },
      { protocol: "https", hostname: "**.yelp.com" },
      { protocol: "https", hostname: "**.viator.com" },
      { protocol: "https", hostname: "**.booking.com" },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
