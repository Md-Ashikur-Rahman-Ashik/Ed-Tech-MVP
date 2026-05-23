"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
            Welcome back
          </h1>
          <p className="text-secondary text-sm mb-8">
            Sign in to continue your learning
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 disabled:bg-muted text-black font-bold py-3 rounded-lg text-base flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p className="text-center mt-6 text-sm text-secondary">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-accent font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
