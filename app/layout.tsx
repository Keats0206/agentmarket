import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Hot 100 AI — The Canonical Index of AI Agents, MCP Servers & Agentic Tools",
    template: "%s — Hot 100 AI",
  },
  description:
    "Discover, compare, and choose the right AI agents, MCP servers, and agentic tools for your stack. Built for developers, by developers.",
  keywords: [
    "AI agents",
    "MCP servers",
    "Model Context Protocol",
    "LangChain",
    "CrewAI",
    "AutoGPT",
    "AI tools",
    "agent framework",
    "LLM tools",
    "AI developer tools",
  ],
  openGraph: {
    title: "Hot 100 AI — The BuiltWith for AI Agents",
    description: "The canonical index of AI agents, MCP servers, and agentic tools.",
    url: BASE_URL,
    siteName: "Hot 100 AI",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Hot 100 AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hot 100 AI — The BuiltWith for AI Agents",
    description: "The canonical index of AI agents, MCP servers, and agentic tools.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
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
      "The canonical index of AI agents, MCP servers, and agentic tools.",
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
