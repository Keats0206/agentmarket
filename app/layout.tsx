import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Lora } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: {
    default: "AgentIndex — The Canonical Index of AI Agents, MCP Servers & Agentic Tools",
    template: "%s — AgentIndex",
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
    title: "AgentIndex — The BuiltWith for AI Agents",
    description: "The canonical index of AI agents, MCP servers, and agentic tools.",
    url: "https://agentindex.dev",
    siteName: "AgentIndex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentIndex — The BuiltWith for AI Agents",
    description: "The canonical index of AI agents, MCP servers, and agentic tools.",
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
