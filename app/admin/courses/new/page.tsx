"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Loader2 } from "lucide-react";

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teachers, setTeachers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTeachers() {
      const supabase = createClient();
      const { data } = await supabase.from("teachers").select("id, name");
      setTeachers(data || []);
      if (data && data.length > 0) setTeacherId(data[0].id);
    }
    loadTeachers();
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    const generated = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generated);
  }

  async function handleSubmit() {
    if (!title || !slug || !price || !teacherId) {
      setError("Please fill in all required fields.");
      return;
    }
    if (isNaN(Number(price)) || Number(price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data: existing } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      setError(
        "This slug is already taken. Please modify the course title or slug.",
      );
      setLoading(false);
      return;
    }

    const { data: course, error: insertError } = await supabase
      .from("courses")
      .insert({
        title,
        slug,
        description,
        price: Number(price),
        thumbnail_url: thumbnailUrl || null,
        teacher_id: teacherId,
        is_published: false,
      })
      .select()
      .single();

    if (insertError) {
      setError("Failed to create course. Please try again.");
      setLoading(false);
      return;
    }

    router.push(`/admin/courses/${course.id}/lessons`);
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border bg-card px-8 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-accent" />
          <span className="font-display font-bold text-primary">শিক্ষালয়</span>
          <span className="text-muted text-sm ml-2">/ New Course</span>
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
          Create New Course
        </h1>
        <p className="text-secondary text-sm mb-8">
          Fill in the details below. You can add lessons after creating the
          course.
        </p>

        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
          {teachers.length === 0 ? (
            <div className="bg-accent/10 border border-accent/30 text-accent px-4 py-3 rounded-lg text-sm">
              ⚠️ No teachers found. Please add a teacher in Supabase → teachers
              table first.
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Teacher <span className="text-danger">*</span>
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Course Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. SSC Physics Complete Course 2025"
              className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              URL Slug <span className="text-danger">*</span>
              <span className="text-muted font-normal ml-2">
                (auto-generated, can edit)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-muted text-sm flex-shrink-0">
                shikkhalo.com/courses/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                placeholder="ssc-physics-2025"
                className="flex-1 bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will students learn in this course?"
              rows={4}
              className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Price (BDT) <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">
                ৳
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="500"
                min="0"
                className="w-full bg-elevated border border-border rounded-lg pl-8 pr-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Thumbnail URL
              <span className="text-muted font-normal ml-2">(optional)</span>
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
            <p className="text-xs text-muted mt-1.5">
              Upload an image to Google Drive or Imgur and paste the direct link
              here
            </p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || teachers.length === 0}
            className="w-full bg-accent hover:bg-accent-hover disabled:bg-muted text-white font-bold py-3.5 rounded-lg text-base flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating..." : "Create Course & Add Lessons →"}
          </button>
        </div>
      </div>
    </div>
  );
}
