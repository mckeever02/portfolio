import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Michael McKeever - Software Designer",
  description: "Product design portfolio of Michael McKeever, a product designer based in Belfast, Northern Ireland.",
  icons: {
    icon: "/images/favicon.svg",
  },
  openGraph: {
    title: "Michael McKeever - Software Designer",
    description: "Product design portfolio of Michael McKeever, a product designer based in Belfast, Northern Ireland.",
    images: [
      {
        url: "/images/social-share.png",
        width: 1200,
        height: 630,
        alt: "Michael McKeever - Software Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael McKeever - Software Designer",
    description: "Product design portfolio of Michael McKeever, a product designer based in Belfast, Northern Ireland.",
    images: ["/images/social-share.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
