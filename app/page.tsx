import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  BookOpen,
  Users,
  PlayCircle,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default async function LandingPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select(
      `id, title, slug, description, thumbnail_url, price, teachers ( name, photo_url )`,
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="bg-bg min-h-screen">
      <nav className="border-b border-border px-8 h-16 flex items-center justify-between sticky top-0 bg-bg z-50">
        <div className="flex items-center gap-2">
          <BookOpen size={22} className="text-accent" />
          <span className="font-display text-xl font-bold text-primary">
            শিক্ষালয়
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-secondary text-sm font-medium hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-accent text-black px-5 py-2 rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-8 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-block bg-accent/10 border border-accent text-accent px-4 py-1 rounded-full text-xs font-semibold tracking-wide mb-6">
            ✦ 215,000+ Students Trust Us
          </div>
          <h1 className="text-5xl lg:text-6xl font-display font-black text-primary mb-6 leading-none">
            Learn From
            <span className="block text-accent">Bangladesh's Best</span>
            Teachers
          </h1>
          <p className="text-secondary text-lg mb-10 max-w-md leading-relaxed">
            Structured courses, expert teachers, and a community that grows
            together. No more scattered WhatsApp groups.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/signup"
              className="bg-accent text-black px-8 py-3 rounded-lg font-bold text-base flex items-center gap-2 hover:bg-accent/90 transition-colors"
            >
              Browse Courses <ArrowRight size={18} />
            </Link>
            <Link
              href="#courses"
              className="border border-border text-primary px-8 py-3 rounded-lg font-medium text-base hover:border-accent transition-colors"
            >
              View All Courses
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 grid grid-cols-2 gap-4">
          {[
            {
              icon: <Users size={24} className="text-accent" />,
              value: "215K+",
              label: "Community Members",
            },
            {
              icon: <BookOpen size={24} className="text-accent" />,
              value: `${courses?.length ?? 0}+`,
              label: "Active Courses",
            },
            {
              icon: <PlayCircle size={24} className="text-accent" />,
              value: "100%",
              label: "Video Lessons",
            },
            {
              icon: <Star size={24} className="text-accent" />,
              value: "4.9",
              label: "Average Rating",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-elevated border border-border rounded-xl p-5"
            >
              {stat.icon}
              <div className="text-3xl font-display font-bold text-primary mt-2">
                {stat.value}
              </div>
              <div className="text-xs text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="courses" className="max-w-6xl mx-auto px-8 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-display font-bold text-primary mb-2">
            Available Courses
          </h2>
          <p className="text-secondary">
            Handpicked by expert teachers. One-time payment. Lifetime access.
          </p>
        </div>

        {!courses || courses.length === 0 ? (
          <div className="text-center py-16 text-muted border border-dashed border-border rounded-xl">
            Courses coming soon. Check back shortly.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group block no-underline"
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 group-hover:border-accent group-hover:-translate-y-1">
                  <div
                    className="h-44 bg-elevated border-b border-border flex items-center justify-center"
                    style={
                      course.thumbnail_url
                        ? {
                            backgroundImage: `url(${course.thumbnail_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : {}
                    }
                  >
                    {!course.thumbnail_url && (
                      <BookOpen size={40} className="text-muted" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-primary mb-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-sm text-secondary mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-accent">
                        ৳{course.price}
                      </span>
                      <span className="text-xs text-muted">
                        {(course.teachers as any)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-display font-bold text-center text-primary mb-12">
          Why Choose শিক্ষালয়?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Structured Learning",
              desc: "No more scattered messages. Everything in one place — videos, PDFs, and your progress.",
            },
            {
              title: "Lifetime Access",
              desc: "Pay once. Revisit lessons whenever you need. No expiry, no recurring fees.",
            },
            {
              title: "Expert Teachers",
              desc: "Learn directly from teachers with proven track records and thousands of satisfied students.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-card border border-border rounded-xl p-7"
            >
              <CheckCircle size={24} className="text-green mb-4" />
              <h3 className="text-lg font-bold text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-secondary text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-muted text-sm">
        © {new Date().getFullYear()} শিক্ষালয় · Built for Bangladesh's learners
      </footer>
    </main>
  );
}
