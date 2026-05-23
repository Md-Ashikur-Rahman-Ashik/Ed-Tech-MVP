import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import AdminActions from "./AdminActions";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: payments } = await supabase
    .from("payments")
    .select(
      `
      id, amount, bkash_number, transaction_id, status, submitted_at, user_id,
      enrollments ( id, status ),
      courses ( title, slug )
    `,
    )
    .order("submitted_at", { ascending: false });

  const userIds = [...new Set(payments?.map((p) => p.user_id) || [])];
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in(
      "id",
      userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"],
    );

  const profileMap = Object.fromEntries(
    profilesData?.map((p) => [p.id, p.full_name]) || [],
  );

  const paymentsWithNames =
    payments?.map((p) => ({
      ...p,
      student_name: profileMap[p.user_id] || "Unknown Student",
    })) || [];

  const pending = paymentsWithNames.filter((p) => p.status === "pending");
  const verified = paymentsWithNames.filter((p) => p.status === "verified");
  const rejected = paymentsWithNames.filter((p) => p.status === "rejected");

  return (
    <div className="min-h-screen bg-bg">
      {/* NAV */}
      <nav className="border-b border-border bg-card px-8 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-accent" />
          <span className="font-display font-bold text-primary">শিক্ষালয়</span>
          <span className="text-muted text-sm ml-2">/ Admin</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-secondary hover:text-primary transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "Pending Review",
              value: pending.length,
              classes: "text-accent",
            },
            {
              label: "Verified",
              value: verified.length,
              classes: "text-green",
            },
            {
              label: "Rejected",
              value: rejected.length,
              classes: "text-danger",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-5 text-center"
            >
              <div
                className={`text-3xl font-display font-bold ${stat.classes}`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-display font-bold text-primary mb-4">
          Pending Payments ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl text-muted text-sm mb-10">
            No pending payments — you're all caught up!
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-10">
            {pending.map((payment: any) => (
              <div
                key={payment.id}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-primary mb-0.5">
                      {payment.student_name}
                    </div>
                    <div className="text-sm text-secondary mb-2">
                      {payment.courses?.title}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted">
                      <span>
                        Amount:{" "}
                        <strong className="text-primary">
                          ৳{payment.amount}
                        </strong>
                      </span>
                      <span>
                        From:{" "}
                        <strong className="text-primary">
                          {payment.bkash_number}
                        </strong>
                      </span>
                      <span>
                        TxID:{" "}
                        <strong className="text-primary font-mono">
                          {payment.transaction_id}
                        </strong>
                      </span>
                      <span>
                        Submitted:{" "}
                        <strong className="text-primary">
                          {new Date(payment.submitted_at).toLocaleString(
                            "en-BD",
                          )}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <AdminActions
                    paymentId={payment.id}
                    enrollmentId={payment.enrollments?.id}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {verified.length > 0 && (
          <>
            <h2 className="text-xl font-display font-bold text-primary mb-4">
              Recently Verified ({verified.length})
            </h2>
            <div className="flex flex-col gap-3">
              {verified.slice(0, 5).map((payment: any) => (
                <div
                  key={payment.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-primary text-sm">
                      {payment.student_name}
                    </div>
                    <div className="text-xs text-muted">
                      {payment.courses?.title} · ৳{payment.amount}
                    </div>
                  </div>
                  <span className="text-xs bg-green/10 text-green border border-green/30 px-3 py-1 rounded-full font-semibold">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
