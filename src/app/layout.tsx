import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "dat.ngo — Nguyễn Phạm Quốc Đạt",
    template: "%s | dat.ngo",
  },
  description:
    "Blog của Nguyễn Phạm Quốc Đạt — Co-Founder @ REALITECH, Founder @ WeDev. Viết về Spatial Computing, WebAR/XR, System Architecture, AI applications và hành trình Founder.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dat.ngo"),
  openGraph: {
    siteName: "dat.ngo",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@datngo",
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-neutral-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
