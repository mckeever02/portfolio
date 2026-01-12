import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Michael McKeever - Software Designer",
  description: "Product design portfolio of Michael McKeever, a software designer based in Belfast, Northern Ireland.",
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
      </body>
    </html>
  );
}
