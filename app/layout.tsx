import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "শিক্ষালয় — Learn from Bangladesh's Best Teachers",
  description:
    "Structured courses from expert Bangladeshi teachers. One-time payment, lifetime access.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
