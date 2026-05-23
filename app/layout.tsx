import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://shikkhalo.vercel.app",
  ),
  title: {
    default: "শিক্ষালয় — Learn from Bangladesh's Best Teachers",
    template: "%s | শিক্ষালয়",
  },
  description:
    "Structured SSC & HSC courses from expert Bangladeshi teachers. One-time payment, lifetime access. Join 215,000+ students.",
  keywords: [
    "SSC course Bangladesh",
    "HSC course Bangladesh",
    "online class Bangladesh",
    "Anamul Sir",
    "বাংলাদেশ অনলাইন ক্লাস",
    "এসএসসি কোর্স",
    "এইচএসসি কোর্স",
  ],
  authors: [{ name: "শিক্ষালয়" }],
  creator: "শিক্ষালয়",
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    siteName: "শিক্ষালয়",
    title: "শিক্ষালয় — Learn from Bangladesh's Best Teachers",
    description:
      "Structured SSC & HSC courses from expert Bangladeshi teachers. One-time payment, lifetime access.",
  },
  twitter: {
    card: "summary_large_image",
    title: "শিক্ষালয় — Learn from Bangladesh's Best Teachers",
    description:
      "Structured SSC & HSC courses from expert Bangladeshi teachers. One-time payment, lifetime access.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
