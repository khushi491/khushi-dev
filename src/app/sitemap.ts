import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const vercel = process.env.VERCEL_URL;
  const base = vercel ? `https://${vercel}` : "http://localhost:3000";
  return [
    {
      url: base,
      lastModified: new Date('2026-11-11'),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
