"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Loader2, Copy, CheckCheck, ArrowLeft } from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "bkash",
    name: "bKash",
    number: process.env.NEXT_PUBLIC_BKASH_NUMBER!,
    color: "#E2136E",
    instruction: "Go to bKash app → Send Money → enter number & amount",
  },
  {
    id: "nagad",
    name: "Nagad",
    number: process.env.NEXT_PUBLIC_NAGAD_NUMBER!,
    color: "#F05829",
    instruction: "Go to Nagad app → Send Money → enter number & amount",
  },
  {
    id: "rocket",
    name: "Rocket",
    number: process.env.NEXT_PUBLIC_ROCKET_NUMBER!,
    color: "#8B2FC9",
    instruction: "Go to Rocket app → Send Money → enter number & amount",
  },
];

export default function EnrollPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [course, setCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { slug: s } = await params;
      setSlug(s);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: course } = await supabase
        .from("courses")
        .select("id, title, slug, price, thumbnail_url, teachers(name)")
        .eq("slug", s)
        .eq("is_published", true)
        .single();

      if (!course) {
        router.push("/");
        return;
      }

      const { data: existing } = await supabase
        .from("enrollments")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .single();

      if (existing?.status === "active") {
        router.push(`/course/${s}/learn`);
        return;
      }

      if (existing?.status === "pending") {
        router.push("/dashboard");
        return;
      }

      setCourse(course);
      setPageLoading(false);
    }
    load();
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(selectedMethod.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit() {
    if (!senderNumber || !transactionId) {
      setError("Please fill in all fields.");
      return;
    }
    if (senderNumber.length < 11) {
      setError("Please enter a valid mobile number.");
      return;
    }
    if (transactionId.length < 6) {
      setError("Please enter a valid transaction ID.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data: enrollment, error: enrollError } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        course_id: course.id,
        status: "pending",
      })
      .select()
      .single();

    if (enrollError) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    const { error: paymentError } = await supabase.from("payments").insert({
      user_id: user.id,
      course_id: course.id,
      enrollment_id: enrollment.id,
      amount: course.price,
      bkash_number: senderNumber,
      transaction_id: transactionId,
      status: "pending",
    });

    if (paymentError) {
      setError("Payment record failed. Please contact support.");
      setLoading(false);
      return;
    }

    router.push("/dashboard?enrolled=true");
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 size={32} className="text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border bg-card px-8 h-16 flex items-center justify-between">
        <Link
          href={`/courses/${slug}`}
          className="flex items-center gap-2 text-secondary text-sm hover:text-primary transition-colors no-underline"
        >
          <ArrowLeft size={16} /> Back to course
        </Link>
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-accent" />
          <span className="font-display font-bold text-primary">শিক্ষালয়</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-2xl p-5 mb-8 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl bg-elevated flex-shrink-0 flex items-center justify-center"
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
              <BookOpen size={24} className="text-muted" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted uppercase tracking-widest mb-0.5">
              Enrolling in
            </div>
            <div className="font-bold text-primary text-base">
              {course.title}
            </div>
            <div className="text-sm text-secondary">
              {(course.teachers as any)?.name}
            </div>
          </div>
          <div className="text-2xl font-display font-black text-accent">
            ৳{course.price}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <h2 className="font-bold text-primary text-lg">
              Choose payment method
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  selectedMethod.id === method.id
                    ? "border-accent bg-accent/5"
                    : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <div className="font-bold text-base text-primary">
                  {method.name}
                </div>
                <div className="text-xs text-muted mt-0.5">Send Money</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <h2 className="font-bold text-primary text-lg">
              Send ৳{course.price} to this number
            </h2>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-muted uppercase tracking-widest mb-1">
                  {selectedMethod.name} Number
                </div>
                <div className="text-2xl font-bold text-primary tracking-widest">
                  {selectedMethod.number}
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-elevated border border-border px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:border-accent transition-all cursor-pointer"
              >
                {copied ? (
                  <CheckCheck size={15} className="text-green" />
                ) : (
                  <Copy size={15} />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-elevated rounded-lg px-4 py-3 text-sm text-secondary">
              💡 {selectedMethod.instruction}
            </div>
            <div className="mt-3 bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-sm text-accent font-medium">
              ⚠️ Send exactly ৳{course.price} — do not send a different amount
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <h2 className="font-bold text-primary text-lg">
              Enter your payment details
            </h2>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Your {selectedMethod.name} Number{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Transaction ID <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                placeholder="e.g. ABC1234567"
                className="w-full bg-elevated border border-border rounded-lg px-4 py-3 text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted font-mono"
              />
              <p className="text-xs text-muted mt-1.5">
                Find the Transaction ID in your {selectedMethod.name} app under
                recent transactions
              </p>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover disabled:bg-muted text-white font-bold py-3.5 rounded-lg text-base flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Submitting..." : "Submit Payment for Review"}
            </button>

            <p className="text-xs text-center text-muted">
              Your enrollment will be activated within a few hours after payment
              verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
