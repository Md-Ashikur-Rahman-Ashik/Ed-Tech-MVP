import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Plus, Pencil, Eye, EyeOff } from "lucide-react";

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: courses } = await supabase
    .from("courses")
    .select(
      `
      id, title, slug, price, is_published, created_at,
      teachers ( name )
    `,
    )
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border bg-card px-8 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-accent" />
          <span className="font-display font-bold text-primary">শিক্ষালয়</span>
          <span className="text-muted text-sm ml-2">/ Courses</span>
        </div>
        <Link
          href="/admin"
          className="text-sm text-secondary hover:text-primary transition-colors"
        >
          ← Back to Admin
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary mb-1">
              All Courses
            </h1>
            <p className="text-secondary text-sm">
              {courses?.length || 0} courses total
            </p>
          </div>
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors no-underline"
          >
            <Plus size={16} /> New Course
          </Link>
        </div>

        {!courses || courses.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <BookOpen size={40} className="text-muted mx-auto mb-4" />
            <h3 className="font-bold text-primary mb-2">No courses yet</h3>
            <p className="text-secondary text-sm mb-6">
              Create your first course to get started
            </p>
            <Link
              href="/admin/courses/new"
              className="bg-accent text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-hover transition-colors no-underline"
            >
              Create First Course
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {courses.map((course: any) => (
              <div
                key={course.id}
                className="bg-card border border-border rounded-xl p-5 flex items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-primary">{course.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                        course.is_published
                          ? "bg-green/10 text-green border-green/30"
                          : "bg-muted/10 text-muted border-border"
                      }`}
                    >
                      {course.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted">
                    <span>৳{course.price}</span>
                    <span>{(course.teachers as any)?.name}</span>
                    <span>/{course.slug}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/courses/${course.id}/lessons`}
                    className="flex items-center gap-1.5 bg-elevated border border-border text-secondary px-3 py-2 rounded-lg text-xs font-semibold hover:border-accent hover:text-accent transition-colors no-underline"
                  >
                    Lessons
                  </Link>
                  <Link
                    href={`/admin/courses/${course.id}/edit`}
                    className="flex items-center gap-1.5 bg-elevated border border-border text-secondary px-3 py-2 rounded-lg text-xs font-semibold hover:border-accent hover:text-accent transition-colors no-underline"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                  <Link
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 bg-elevated border border-border text-secondary px-3 py-2 rounded-lg text-xs font-semibold hover:border-accent hover:text-accent transition-colors no-underline"
                  >
                    {course.is_published ? (
                      <Eye size={12} />
                    ) : (
                      <EyeOff size={12} />
                    )}{" "}
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
