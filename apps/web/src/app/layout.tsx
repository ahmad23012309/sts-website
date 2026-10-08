import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { StickyActions } from "@/components/layout/StickyActions";
import { PreviewDataNotice } from "@/components/layout/PreviewDataNotice";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Rent a Car in Pakistan`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: true, address: false, email: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
  },
};

export const viewport: Viewport = {
  themeColor: "#121214",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PK">
      <body>
        <a
          href="#main"
          className="sr-only font-ui focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-pill focus:bg-yellow focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>

        <PreviewDataNotice />
        <TopBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyActions />

        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
