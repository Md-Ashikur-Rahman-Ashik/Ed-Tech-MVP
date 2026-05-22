import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  BookOpen,
  PlayCircle,
  FileText,
  Clock,
  ArrowLeft,
  Lock,
} from "lucide-react";

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
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "var(--bg)",
          zIndex: 100,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
          }}
        >
          <ArrowLeft size={16} /> Back to courses
        </Link>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/login"
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            Login
          </Link>
          <Link
            href="/signup"
            style={{
              background: "var(--accent)",
              color: "#000",
              padding: "0.5rem 1.25rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Enroll Now
          </Link>
        </div>
      </nav>

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 900,
                color: "var(--text-primary)",
                marginBottom: "1rem",
                lineHeight: 1.2,
              }}
            >
              {course.title}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.7,
                marginBottom: "2rem",
              }}
            >
              {course.description}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.25rem",
                marginBottom: "2.5rem",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: teacher?.photo_url
                    ? `url(${teacher.photo_url}) center/cover`
                    : "var(--bg-elevated)",
                  border: "2px solid var(--accent)",
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.2rem",
                  }}
                >
                  Your Teacher
                </div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  {teacher?.name}
                </div>
                {teacher?.bio && (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      marginTop: "0.2rem",
                    }}
                  >
                    {teacher.bio}
                  </div>
                )}
              </div>
            </div>

            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "var(--text-primary)",
              }}
            >
              Course Content ({lessons?.length || 0} lessons)
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {lessons?.map((lesson, index) => (
                <div
                  key={lesson.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.9rem 1rem",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                      minWidth: "24px",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: lesson.is_free_preview
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      {lesson.title}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    {lesson.youtube_url && (
                      <PlayCircle size={15} color="var(--text-muted)" />
                    )}
                    {lesson.pdf_url && (
                      <FileText size={15} color="var(--text-muted)" />
                    )}
                    {lesson.is_free_preview ? (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          background: "var(--green-light)",
                          color: "var(--green)",
                          border: "1px solid var(--green)",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "100px",
                          fontWeight: 600,
                        }}
                      >
                        Free Preview
                      </span>
                    ) : (
                      <Lock size={13} color="var(--text-muted)" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "sticky", top: "80px" }}>
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {course.thumbnail_url && (
                <div
                  style={{
                    height: "180px",
                    background: `url(${course.thumbnail_url}) center/cover`,
                    borderBottom: "1px solid var(--border)",
                  }}
                />
              )}
              <div style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "var(--accent)",
                    fontFamily: "Playfair Display, serif",
                    marginBottom: "0.25rem",
                  }}
                >
                  ৳{course.price}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    marginBottom: "1.5rem",
                  }}
                >
                  One-time payment · Lifetime access
                </div>
                <Link
                  href={`/enroll/${course.slug}`}
                  style={{
                    display: "block",
                    background: "var(--accent)",
                    color: "#000",
                    textAlign: "center",
                    padding: "0.9rem",
                    borderRadius: "8px",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  Enroll Now
                </Link>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {[
                    `${lessons?.length || 0} lessons`,
                    "Lifetime access",
                    "Video + PDF resources",
                    "Mobile friendly",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <span style={{ color: "var(--green)" }}>✓</span> {item}
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
