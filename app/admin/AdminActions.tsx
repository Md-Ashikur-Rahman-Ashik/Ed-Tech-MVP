"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AdminActions({
  paymentId,
  enrollmentId,
}: {
  paymentId: string;
  enrollmentId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleApprove() {
    setLoading("approve");
    const supabase = createClient();

    await supabase
      .from("payments")
      .update({ status: "verified" })
      .eq("id", paymentId);

    await supabase
      .from("enrollments")
      .update({ status: "active" })
      .eq("id", enrollmentId);

    router.refresh();
    setLoading(null);
  }

  async function handleReject() {
    setLoading("reject");
    const supabase = createClient();

    await supabase
      .from("payments")
      .update({ status: "rejected" })
      .eq("id", paymentId);

    await supabase
      .from("enrollments")
      .update({ status: "rejected" })
      .eq("id", enrollmentId);

    router.refresh();
    setLoading(null);
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      <button
        onClick={handleApprove}
        disabled={loading !== null}
        className="flex items-center gap-1.5 bg-green/10 text-green border border-green/30 hover:bg-green/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "approve" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <CheckCircle size={14} />
        )}
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={loading !== null}
        className="flex items-center gap-1.5 bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "reject" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <XCircle size={14} />
        )}
        Reject
      </button>
    </div>
  );
}
