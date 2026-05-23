import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-accent animate-spin" />
        <p className="text-secondary text-sm">Loading...</p>
      </div>
    </div>
  );
}
