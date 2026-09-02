import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Lora, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackButton from "@/components/FeedbackButton";
import { BASE_URL } from "@/lib/config";
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
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Hot 100 AI — The Trust Layer for MCP Discovery",
    template: "%s — Hot 100 AI",
  },
  description:
    "Find MCP servers that actually work for Claude Code, Cursor, ChatGPT, and your AI stack. Curated for production reliability, compatibility, and real-world tradeoffs.",
  keywords: [
    "MCP servers",
    "Model Context Protocol",
    "MCP for Claude Code",
    "MCP for Cursor",
    "persistent memory MCP",
    "MCP production ready",
    "AI tools",
    "agentic tools",
    "Claude integrations",
    "MCP compatibility",
  ],
  openGraph: {
    title: "Hot 100 AI — The Trust Layer for MCP Discovery",
    description: "Find MCP servers that actually work for your AI stack. Built for developers, by developers.",
    url: BASE_URL,
    siteName: "Hot 100 AI",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Hot 100 AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hot 100 AI — The Trust Layer for MCP Discovery",
    description: "Find MCP servers that actually work for your AI stack.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "google-adsense-account": "ca-pub-6171019855331472",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hot 100 AI",
    url: BASE_URL,
    description:
      "The trust layer for MCP discovery. Find MCP servers that actually work for your AI stack.",
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${poppins.variable} antialiased min-h-screen flex flex-col`}
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <FeedbackButton />
        <Analytics />
      </body>
    </html>
  );
}
