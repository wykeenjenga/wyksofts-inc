import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https");
  const origin = host ? `${protocol}://${host}` : "https://wyksofts.com";
  const socialImage = new URL("/og.png", origin);

  return {
    metadataBase: new URL(origin),
    title: "WykSofts Inc. | Software Development & Digital Solutions",
    description:
      "WykSofts Inc. builds mobile apps, websites, custom software, API integrations, AI solutions, and cloud platforms for growing businesses.",
    keywords: [
      "software development",
      "mobile app development",
      "web development",
      "custom software",
      "Nairobi software company",
      "AI solutions",
    ],
    openGraph: {
      title: "WykSofts Inc. | Digital products that move businesses forward",
      description:
        "Mobile apps, websites, custom software, integrations, AI, and cloud solutions—designed and built in Nairobi.",
      type: "website",
      locale: "en_KE",
      siteName: "WykSofts Inc.",
      images: [
        {
          url: socialImage,
          width: 1730,
          height: 909,
          alt: "WykSofts Inc. — Digital products that move businesses forward.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "WykSofts Inc.",
      description: "Digital products that move businesses forward.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
