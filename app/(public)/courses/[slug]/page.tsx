import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, PlayCircle, FileText, ArrowLeft, Lock } from "lucide-react";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select(`*, teachers ( name, bio, photo_url )`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!course) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, youtube_url, pdf_url, lesson_order, is_free_preview")
    .eq("course_id", course.id)
    .order("lesson_order");

  const teacher = course.teachers as any;

  return (
    <main className="bg-bg min-h-screen">
      <nav className="border-b border-border px-8 h-16 flex items-center justify-between sticky top-0 bg-bg z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-secondary text-sm hover:text-primary transition-colors no-underline"
        >
          <ArrowLeft size={16} /> Back to courses
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-secondary text-sm hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-accent text-black px-5 py-2 rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 items-start">
          <div>
            <h1 className="text-4xl lg:text-5xl font-display font-black text-primary mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-secondary text-base leading-relaxed mb-8">
              {course.description}
            </p>
            <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 mb-10">
              <div
                className="w-14 h-14 rounded-full border-2 border-accent flex-shrink-0 bg-elevated"
                style={
                  teacher?.photo_url
                    ? {
                        backgroundImage: `url(${teacher.photo_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}
                }
              />
              <div>
                <div className="text-xs text-muted uppercase tracking-widest mb-0.5">
                  Your Teacher
                </div>
                <div className="font-bold text-primary">{teacher?.name}</div>
                {teacher?.bio && (
                  <div className="text-sm text-secondary mt-0.5">
                    {teacher.bio}
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-xl font-display font-bold text-primary mb-4">
              Course Content ({lessons?.length || 0} lessons)
            </h2>
            <div className="flex flex-col gap-2">
              {lessons?.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 px-4 py-3 bg-card border border-border rounded-lg"
                >
                  <span className="text-xs text-muted font-semibold w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 text-sm font-medium text-secondary">
                    {lesson.title}
                  </div>
                  <div className="flex items-center gap-2">
                    {lesson.youtube_url && (
                      <PlayCircle size={14} className="text-muted" />
                    )}
                    {lesson.pdf_url && (
                      <FileText size={14} className="text-muted" />
                    )}
                    {lesson.is_free_preview ? (
                      <span className="text-xs bg-green/10 text-green border border-green px-2 py-0.5 rounded-full font-semibold">
                        Free
                      </span>
                    ) : (
                      <Lock size={12} className="text-muted" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky top-20">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {course.thumbnail_url && (
                <div
                  className="h-44 border-b border-border"
                  style={{
                    backgroundImage: `url(${course.thumbnail_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              <div className="p-6">
                <div className="text-4xl font-display font-black text-accent mb-1">
                  ৳{course.price}
                </div>
                <div className="text-xs text-muted mb-6">
                  One-time payment · Lifetime access
                </div>
                <Link
                  href={`/enroll/${course.slug}`}
                  className="block w-full bg-accent text-black text-center py-3 rounded-lg font-bold text-base hover:bg-accent/90 transition-colors mb-4 no-underline"
                >
                  Enroll Now
                </Link>
                <div className="flex flex-col gap-2">
                  {[
                    `${lessons?.length || 0} lessons`,
                    "Lifetime access",
                    "Video + PDF resources",
                    "Mobile friendly",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-secondary"
                    >
                      <span className="text-green">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
