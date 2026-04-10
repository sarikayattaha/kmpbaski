import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";
import { OrganizationSchema, WebSiteSchema } from "@/app/components/SEO/Schema";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Profesyonel Baskı ve Ambalaj Çözümleri`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Kartvizit, broşür, katalog, tabela, ambalaj ve promosyon baskıda profesyonel çözümler. KMP Baskı ile kaliteyi keşfedin.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: SITE_NAME,
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
        <WebSiteSchema />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
