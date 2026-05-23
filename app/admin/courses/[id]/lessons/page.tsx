"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Loader2, Trash2, GripVertical, Plus } from "lucide-react";

export default function ManageLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      setCourseId(id);
      const supabase = createClient();

      const { data: course } = await supabase
        .from("courses")
        .select("id, title, slug")
        .eq("id", id)
        .single();

      if (!course) {
        router.push("/admin/courses");
        return;
      }
      setCourse(course);

      const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", id)
        .order("lesson_order");

      setLessons(lessons || []);
      setPageLoading(false);
    }
    load();
  }, []);

  async function handleAddLesson() {
    if (!title) {
      setError("Lesson title is required.");
      return;
    }
    if (!youtubeUrl && !pdfUrl) {
      setError("Please add at least a YouTube URL or a PDF URL.");
      return;
    }

    setAdding(true);
    setError("");
    const supabase = createClient();

    const { data: newLesson, error: insertError } = await supabase
      .from("lessons")
      .insert({
        course_id: courseId,
        title,
        youtube_url: youtubeUrl || null,
        pdf_url: pdfUrl || null,
        lesson_order: lessons.length + 1,
        is_free_preview: isFreePreview,
      })
      .select()
      .single();

    if (insertError) {
      setError("Failed to add lesson. Please try again.");
      setAdding(false);
      return;
    }

    setLessons((prev) => [...prev, newLesson]);
    setTitle("");
    setYoutubeUrl("");
    setPdfUrl("");
    setIsFreePreview(false);
    setAdding(false);
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!confirm("Delete this lesson?")) return;
    const supabase = createClient();
    await supabase.from("lessons").delete().eq("id", lessonId);
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
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
          <span className="text-muted text-sm ml-2">/ Lessons</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/courses/${courseId}/edit`}
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            Edit Course Details
          </Link>
          <Link
            href="/admin/courses"
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            ← Back to Courses
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-1">
            {course.title}
          </h1>
          <p className="text-secondary text-sm">
            {lessons.length} lessons · Manage course content below
          </p>
        </div>

        {lessons.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">
              Current Lessons
            </h2>
            <div className="flex flex-col gap-2">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3"
                >
                  <GripVertical
                    size={16}
                    className="text-muted flex-shrink-0"
                  />
                  <span className="text-xs text-muted font-semibold w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-primary">
                      {lesson.title}
                    </div>
                    <div className="flex gap-3 mt-0.5 text-xs text-muted">
                      {lesson.youtube_url && <span>📹 Video</span>}
                      {lesson.pdf_url && <span>📄 PDF</span>}
                      {lesson.is_free_preview && (
                        <span className="text-green font-semibold">
                          Free Preview
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="text-muted hover:text-danger transition-colors cursor-pointer p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">
            Add New Lesson
          </h2>
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Lesson Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 1: Introduction to Physics"
                className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                YouTube Video URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
              <p className="text-xs text-muted mt-1.5">
                Upload to YouTube as <strong>Unlisted</strong> then paste the
                link here
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                PDF URL
                <span className="text-muted font-normal ml-2">(optional)</span>
              </label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
              <p className="text-xs text-muted mt-1.5">
                Upload PDF to Google Drive, set to "Anyone with link", paste
                here
              </p>
            </div>

            <div className="flex items-center justify-between bg-elevated border border-border rounded-xl px-4 py-3">
              <div>
                <div className="font-semibold text-primary text-sm">
                  Free Preview
                </div>
                <div className="text-xs text-muted">
                  Students can watch this without enrolling
                </div>
              </div>
              <button
                onClick={() => setIsFreePreview(!isFreePreview)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  isFreePreview ? "bg-accent" : "bg-border"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    isFreePreview ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAddLesson}
              disabled={adding}
              className="w-full bg-accent hover:bg-accent-hover disabled:bg-muted text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {adding ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <Plus size={15} /> Add Lesson
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-accent/10 border border-accent/30 rounded-xl px-5 py-4 text-sm text-accent">
          <strong>Remember:</strong> Go to{" "}
          <Link
            href={`/admin/courses/${courseId}/edit`}
            className="underline font-semibold"
          >
            Edit Course
          </Link>{" "}
          and toggle <strong>Published</strong> on when you're ready for
          students to see this course.
        </div>
      </div>
    </div>
  );
}
