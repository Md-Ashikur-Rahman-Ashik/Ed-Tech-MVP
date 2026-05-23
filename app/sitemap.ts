import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shikkhalo.vercel.app";

  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("slug, created_at")
    .eq("is_published", true);

  const courseUrls: MetadataRoute.Sitemap = (courses || []).map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: new Date(course.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...courseUrls,
  ];
}
