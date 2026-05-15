import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";
import { OrganizationSchema, WebSiteSchema } from "@/app/components/SEO/Schema";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Profesyonel Baskı ve Ambalaj Çözümleri`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Kartvizit, broşür, katalog, tabela, ambalaj ve promosyon baskıda profesyonel çözümler. KMP Baskı ile kaliteyi keşfedin.",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/kmpbaskilogo.png",
    apple: "/kmpbaskilogo.png",
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/kmpbaskilogo.png", width: 512, height: 512, alt: SITE_NAME }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
    : null;

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {supabaseHost && (
          <>
            <link rel="preconnect" href={supabaseHost} />
            <link rel="dns-prefetch" href={supabaseHost} />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
        <WebSiteSchema />
        {children}
        <WhatsAppButton />
        <GoogleAnalytics gaId="G-8L0PPR3DMD" />
      </body>
    </html>
  );
}
