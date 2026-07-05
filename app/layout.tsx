import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://poweredbynexora.com"),

  title: {
    default: "Nexora | AI Workforce for Modern Businesses",
    template: "%s | Nexora",
  },

  description:
    "Deploy AI employees across inbox, CRM, admin, finance, reporting and workflows. Nexora automates busywork and keeps your business moving.",

  keywords: [
    "Nexora",
    "Powered by Nexora",
    "AI employees",
    "AI workforce",
    "business automation",
    "AI CRM",
    "AI inbox assistant",
    "workflow automation",
    "AI business automation",
  ],

  authors: [{ name: "Nexora" }],
  creator: "Nexora",
  publisher: "Nexora",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Nexora | AI Workforce for Modern Businesses",
    description:
      "Deploy AI employees across inbox, CRM, admin, finance, reporting and workflows. One AI workforce built to keep your business moving.",
    url: "https://poweredbynexora.com",
    siteName: "Nexora",
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Nexora | AI Workforce for Modern Businesses",
    description:
      "AI employees for inbox, CRM, admin, finance, reporting and workflows.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}