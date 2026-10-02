import type { Metadata } from "next";
import { Amiri, IBM_Plex_Sans_Arabic, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PixelLoader } from "@/components/pixels/PixelLoader";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans_Arabic({
  weight: ["400", "500", "700"],
  subsets: ["arabic"],
  variable: "--font-ibm-plex",
  display: "swap",
});

const outfit = Outfit({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "نوا للبيت · ريحة، ضوء، وهواء",
    template: "%s · نوا للبيت",
  },
  description:
    "ثلاث طقوس للبيت السعودي: عود بلا فحم، شفق للغرفة، ومنقّي HEPA-13. الدفع عند الاستلام.",
  metadataBase: new URL("https://nawahouse.shop"),
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "نوا للبيت",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${ibmPlex.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-paper text-ink" suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <PixelLoader />
      </body>
    </html>
  );
}
