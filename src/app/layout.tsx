import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import "./globals.css";

const gtCinetype = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Cinetype-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Cinetype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Cinetype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cinetype",
  display: "swap",
});

const gtEraDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Era-Display-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-era",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Michael McKeever - Software Designer",
  description: "Product design portfolio of Michael McKeever, a product designer based in Belfast, Northern Ireland.",
  icons: {
    icon: "/favicon.ico",
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
    <html lang="en" className={`${gtCinetype.variable} ${gtEraDisplay.variable}`}>
      <body className={`${gtCinetype.className} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
