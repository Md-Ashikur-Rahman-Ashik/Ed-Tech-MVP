import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, FileText, Lock, ChevronRight } from "lucide-react";

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { slug } = await params;
  const { lesson: lessonParam } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug, teachers(name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!course) notFound();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("status")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .single();

  if (!enrollment || enrollment.status !== "active") {
    redirect(`/enroll/${slug}`);
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, youtube_url, pdf_url, lesson_order, is_free_preview")
    .eq("course_id", course.id)
    .order("lesson_order");

  const currentLesson = lessonParam
    ? lessons?.find((l) => l.id === lessonParam)
    : lessons?.[0];

  function getYouTubeId(url: string) {
    const match = url?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    );
    return match?.[1] || null;
  }

  const videoId = currentLesson?.youtube_url
    ? getYouTubeId(currentLesson.youtube_url)
    : null;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <nav className="border-b border-border bg-card px-6 h-14 flex items-center justify-between flex-shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-muted hover:text-primary transition-colors"
          >
            <BookOpen size={20} />
          </Link>
          <ChevronRight size={14} className="text-muted" />
          <span className="text-sm font-semibold text-primary truncate max-w-xs">
            {course.title}
          </span>
        </div>
        <span className="text-xs text-muted">
          {(course.teachers as any)?.name}
        </span>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-border bg-card flex-shrink-0 overflow-y-auto hidden lg:block">
          <div className="p-4 border-b border-border">
            <div className="text-xs text-muted uppercase tracking-widest">
              Course Content
            </div>
            <div className="text-sm font-semibold text-primary mt-0.5">
              {lessons?.length} lessons
            </div>
          </div>
          <div className="flex flex-col">
            {lessons?.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/course/${slug}/learn?lesson=${lesson.id}`}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border text-sm transition-colors no-underline ${
                  currentLesson?.id === lesson.id
                    ? "bg-accent/10 text-accent font-semibold border-l-2 border-l-accent"
                    : "text-secondary hover:bg-elevated hover:text-primary"
                }`}
              >
                <span className="text-xs text-muted w-5 flex-shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 leading-snug">{lesson.title}</span>
                <div className="flex gap-1 flex-shrink-0">
                  {lesson.youtube_url && (
                    <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-accent border-b-[3px] border-b-transparent ml-0.5" />
                    </div>
                  )}
                  {lesson.pdf_url && (
                    <FileText size={12} className="text-muted" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto px-4 py-6">
              {videoId ? (
                <div
                  className="relative w-full rounded-xl overflow-hidden bg-black mb-6"
                  style={{ paddingTop: "56.25%" }}
                >
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  className="w-full rounded-xl bg-elevated border border-border flex items-center justify-center mb-6"
                  style={{ paddingTop: "56.25%", position: "relative" }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
                    <Lock size={32} className="mb-2" />
                    <span className="text-sm">No video for this lesson</span>
                  </div>
                </div>
              )}

              <h1 className="text-2xl font-display font-bold text-primary mb-2">
                {currentLesson.title}
              </h1>
              <p className="text-sm text-muted mb-6">
                Lesson{" "}
                {(lessons?.findIndex((l) => l.id === currentLesson.id) ?? 0) +
                  1}{" "}
                of {lessons?.length}
              </p>

              {currentLesson.pdf_url && (
                <a
                  href={currentLesson.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-elevated border border-border text-primary px-5 py-3 rounded-lg text-sm font-semibold hover:border-accent hover:text-accent transition-colors no-underline"
                >
                  <FileText size={16} />
                  Download Lesson PDF
                </a>
              )}

              {(() => {
                const currentIndex =
                  lessons?.findIndex((l) => l.id === currentLesson.id) ?? 0;
                const nextLesson = lessons?.[currentIndex + 1];
                return nextLesson ? (
                  <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-xs text-muted uppercase tracking-widest mb-2">
                      Up Next
                    </p>
                    <Link
                      href={`/course/${slug}/learn?lesson=${nextLesson.id}`}
                      className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:border-accent transition-colors no-underline group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                          {nextLesson.title}
                        </div>
                        <div className="text-xs text-muted mt-0.5">
                          Lesson {currentIndex + 2}
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-muted group-hover:text-accent transition-colors"
                      />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-8 pt-6 border-t border-border text-center">
                    <div className="text-2xl mb-2">🎉</div>
                    <div className="font-bold text-primary mb-1">
                      Course Complete!
                    </div>
                    <div className="text-sm text-muted">
                      You've finished all lessons in this course.
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted">
              Select a lesson to begin
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
