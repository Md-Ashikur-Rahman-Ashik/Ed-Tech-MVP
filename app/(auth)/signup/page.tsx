"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!fullName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2.5rem",
            justifyContent: "center",
          }}
        >
          <BookOpen size={22} color="var(--accent)" />
          <span
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.4rem",
              fontWeight: 700,
            }}
          >
            শিক্ষালয়
          </span>
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.35rem",
            }}
          >
            Create account
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              marginBottom: "2rem",
            }}
          >
            Join thousands of students learning today
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {[
              {
                label: "Full Name *",
                value: fullName,
                setter: setFullName,
                type: "text",
                placeholder: "Your full name",
              },
              {
                label: "Email *",
                value: email,
                setter: setEmail,
                type: "email",
                placeholder: "you@example.com",
              },
              {
                label: "Phone (optional)",
                value: phone,
                setter: setPhone,
                type: "tel",
                placeholder: "01XXXXXXXXX",
              },
              {
                label: "Password *",
                value: password,
                setter: setPassword,
                type: "password",
                placeholder: "••••••••",
              },
            ].map((field) => (
              <div key={field.label}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>
            ))}

            {error && (
              <div
                style={{
                  background: "#c0392b18",
                  border: "1px solid var(--danger)",
                  color: "#e74c3c",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              style={{
                background: loading ? "var(--text-muted)" : "var(--accent)",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "0.85rem",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                marginTop: "0.5rem",
              }}
            >
              {loading && (
                <Loader2
                  size={16}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              )}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
