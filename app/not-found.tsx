import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 text-center">
      <BookOpen size={48} className="text-accent mb-6" />
      <h1 className="text-6xl font-display font-black text-primary mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-primary mb-3">Page not found</h2>
      <p className="text-secondary text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        href="/"
        className="bg-accent text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-accent-hover transition-colors no-underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
