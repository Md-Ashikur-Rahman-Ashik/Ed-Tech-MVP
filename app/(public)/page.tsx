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
      `
      id, title, slug, description, thumbnail_url, price,
      teachers ( name, photo_url )
    `,
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BookOpen size={22} color="var(--accent)" />
          <span
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            শিক্ষালয়
          </span>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link
            href="/login"
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
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
            Get Started
          </Link>
        </div>
      </nav>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "6rem 2rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              background: "var(--accent-light)",
              border: "1px solid var(--accent)",
              color: "var(--accent)",
              padding: "0.3rem 0.9rem",
              borderRadius: "100px",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              marginBottom: "1.5rem",
            }}
          >
            ✦ 215,000+ Students Trust Us
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: 900,
              color: "var(--text-primary)",
              marginBottom: "1.5rem",
              lineHeight: 1.1,
            }}
          >
            Learn From
            <span
              style={{
                display: "block",
                color: "var(--accent)",
              }}
            >
              Bangladesh's Best
            </span>
            Teachers
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
              marginBottom: "2.5rem",
              maxWidth: "440px",
            }}
          >
            Structured courses, expert teachers, and a community that grows
            together. No more scattered WhatsApp groups.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/signup"
              style={{
                background: "var(--accent)",
                color: "#000",
                padding: "0.85rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Browse Courses <ArrowRight size={18} />
            </Link>
            <Link
              href="#courses"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                padding: "0.85rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              View All Courses
            </Link>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {[
            {
              icon: <Users size={24} color="var(--accent)" />,
              value: "215K+",
              label: "Community Members",
            },
            {
              icon: <BookOpen size={24} color="var(--accent)" />,
              value: courses?.length + "+",
              label: "Active Courses",
            },
            {
              icon: <PlayCircle size={24} color="var(--accent)" />,
              value: "100%",
              label: "Video Lessons",
            },
            {
              icon: <Star size={24} color="var(--accent)" />,
              value: "4.9",
              label: "Average Rating",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.25rem",
              }}
            >
              {stat.icon}
              <div
                style={{
                  fontSize: "1.75rem",
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginTop: "0.5rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginTop: "0.2rem",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="courses"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "4rem 2rem",
        }}
      >
        <div style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Available Courses
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Handpicked by expert teachers. One-time payment. Lifetime access.
          </p>
        </div>

        {!courses || courses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--text-muted)",
              border: "1px dashed var(--border)",
              borderRadius: "12px",
            }}
          >
            Courses coming soon. Check back shortly.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "border-color 0.2s, transform 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--accent)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--border)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      height: "180px",
                      background: course.thumbnail_url
                        ? `url(${course.thumbnail_url}) center/cover`
                        : "var(--bg-elevated)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {!course.thumbnail_url && (
                      <BookOpen size={40} color="var(--text-muted)" />
                    )}
                  </div>

                  <div style={{ padding: "1.25rem" }}>
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {course.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        marginBottom: "1rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.15rem",
                          fontWeight: 700,
                          color: "var(--accent)",
                        }}
                      >
                        ৳{course.price}
                      </span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
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

      <section
        style={{
          borderTop: "1px solid var(--border)",
          padding: "5rem 2rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          Why Choose শিক্ষালয়?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
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
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.75rem",
              }}
            >
              <CheckCircle
                size={24}
                color="var(--green)"
                style={{ marginBottom: "1rem" }}
              />
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "var(--text-primary)",
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "2rem",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
        }}
      >
        © {new Date().getFullYear()} শিক্ষালয় · Built for Bangladesh's learners
      </footer>
    </main>
  );
}
