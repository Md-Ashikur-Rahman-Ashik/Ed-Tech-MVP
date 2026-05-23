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
      options: { data: { full_name: fullName, phone } },
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
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-10">
          <BookOpen size={22} className="text-accent" />
          <span className="font-display text-2xl font-bold text-primary">
            শিক্ষালয়
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h1 className="text-2xl font-display font-bold text-primary mb-1">
            Create account
          </h1>
          <p className="text-secondary text-sm mb-8">
            Join thousands of students learning today
          </p>

          <div className="flex flex-col gap-4">
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
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
                />
              </div>
            ))}

            {error && (
              <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 disabled:bg-muted text-black font-bold py-3 rounded-lg text-base flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <p className="text-center mt-6 text-sm text-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
