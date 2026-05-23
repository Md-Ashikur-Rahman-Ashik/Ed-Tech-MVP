import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
} from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ enrolled?: string }>;
}) {
  const { enrolled } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      `
      id, status, enrolled_at,
      courses ( id, title, slug, thumbnail_url, teachers ( name ) )
    `,
    )
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  const statusConfig = {
    active: {
      label: "Active",
      icon: <CheckCircle size={14} />,
      classes: "bg-green/10 text-green border-green/30",
    },
    pending: {
      label: "Under Review",
      icon: <Clock size={14} />,
      classes: "bg-accent/10 text-accent border-accent/30",
    },
    rejected: {
      label: "Rejected",
      icon: <XCircle size={14} />,
      classes: "bg-danger/10 text-danger border-danger/30",
    },
  };

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border bg-card px-8 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <BookOpen size={20} className="text-accent" />
          <span className="font-display font-bold text-primary">শিক্ষালয়</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-secondary">
            {profile?.full_name || user.email}
          </span>
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {enrolled && (
          <div className="bg-green/10 border border-green/30 text-green rounded-xl px-5 py-4 mb-8 flex items-center gap-3">
            <CheckCircle size={20} />
            <div>
              <div className="font-semibold">
                Payment submitted successfully!
              </div>
              <div className="text-sm opacity-80">
                Your enrollment is under review. You'll get access once it's
                approved — usually within a few hours.
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-1">
            My Courses
          </h1>
          <p className="text-secondary text-sm">
            {enrollments?.length === 0
              ? "You haven't enrolled in any courses yet."
              : `${enrollments?.length} course${enrollments?.length !== 1 ? "s" : ""} enrolled`}
          </p>
        </div>

        {!enrollments || enrollments.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <BookOpen size={40} className="text-muted mx-auto mb-4" />
            <h3 className="font-bold text-primary mb-2">No courses yet</h3>
            <p className="text-secondary text-sm mb-6">
              Browse our courses and start learning today
            </p>
            <Link
              href="/#courses"
              className="bg-accent text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-hover transition-colors no-underline"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((enrollment: any) => {
              const course = enrollment.courses;
              const status =
                statusConfig[enrollment.status as keyof typeof statusConfig];

              return (
                <div
                  key={enrollment.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <div
                    className="h-36 bg-elevated border-b border-border flex items-center justify-center"
                    style={
                      course?.thumbnail_url
                        ? {
                            backgroundImage: `url(${course.thumbnail_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : {}
                    }
                  >
                    {!course?.thumbnail_url && (
                      <BookOpen size={32} className="text-muted" />
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-primary text-sm mb-1 leading-snug">
                      {course?.title}
                    </h3>
                    <p className="text-xs text-muted mb-3">
                      {course?.teachers?.name}
                    </p>
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border mb-4 ${status.classes}`}
                    >
                      {status.icon}
                      {status.label}
                    </div>

                    {enrollment.status === "active" ? (
                      <Link
                        href={`/course/${course?.slug}/learn`}
                        className="flex items-center justify-center gap-2 w-full bg-accent text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors no-underline"
                      >
                        <PlayCircle size={16} /> Continue Learning
                      </Link>
                    ) : enrollment.status === "pending" ? (
                      <div className="w-full bg-elevated text-muted py-2.5 rounded-lg text-sm text-center">
                        Awaiting approval
                      </div>
                    ) : (
                      <Link
                        href={`/enroll/${course?.slug}`}
                        className="flex items-center justify-center w-full bg-danger/10 text-danger border border-danger/30 py-2.5 rounded-lg text-sm font-semibold hover:bg-danger/20 transition-colors no-underline"
                      >
                        Resubmit Payment
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
