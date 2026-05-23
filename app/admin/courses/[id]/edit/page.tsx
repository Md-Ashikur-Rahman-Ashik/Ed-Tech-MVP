"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Loader2, Trash2 } from "lucide-react";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [courseId, setCourseId] = useState("");

  useEffect(() => {
    async function load() {
      const { id } = await params;
      setCourseId(id);
      const supabase = createClient();
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) {
        router.push("/admin/courses");
        return;
      }

      setCourse(data);
      setTitle(data.title);
      setSlug(data.slug);
      setDescription(data.description || "");
      setPrice(String(data.price));
      setThumbnailUrl(data.thumbnail_url || "");
      setIsPublished(data.is_published);
      setPageLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    if (!title || !slug || !price) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("courses")
      .update({
        title,
        slug,
        description,
        price: Number(price),
        thumbnail_url: thumbnailUrl || null,
        is_published: isPublished,
      })
      .eq("id", courseId);

    if (updateError) {
      setError("Failed to save. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/admin/courses");
  }

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure? This will permanently delete the course and all its lessons.",
      )
    )
      return;

    setDeleteLoading(true);
    const supabase = createClient();
    await supabase.from("courses").delete().eq("id", courseId);
    router.push("/admin/courses");
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 size={32} className="text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border bg-card px-8 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-accent" />
          <span className="font-display font-bold text-primary">শিক্ষালয়</span>
          <span className="text-muted text-sm ml-2">/ Edit Course</span>
        </div>
        <Link
          href="/admin/courses"
          className="text-sm text-secondary hover:text-primary transition-colors"
        >
          ← Back to Courses
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          Edit Course
        </h1>
        <p className="text-secondary text-sm mb-8">
          Changes are saved immediately when you click Save.
        </p>

        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between bg-elevated border border-border rounded-xl px-4 py-3">
            <div>
              <div className="font-semibold text-primary text-sm">
                Published
              </div>
              <div className="text-xs text-muted">
                Students can see and enroll in this course
              </div>
            </div>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                isPublished ? "bg-accent" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isPublished ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Course Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Price (BDT) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">
                ৳
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                className="w-full bg-elevated border border-border rounded-lg pl-8 pr-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-accent hover:bg-accent-hover disabled:bg-muted text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex items-center gap-2 bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 px-4 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {deleteLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
