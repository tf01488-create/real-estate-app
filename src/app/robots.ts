import type { MetadataRoute } from "next";

const BASE_URL = "https://fudousanunyou-toushi-simulators.kawaguchi-tetsuya-tax.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
