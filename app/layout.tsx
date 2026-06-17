import { Metadata } from "next";
import { Montserrat, Oxanium } from 'next/font/google';
// @ts-ignore: allow importing global CSS without type declarations
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";
import LanguageProvider from "@/components/LanguageProvider";
import Script from "next/script";

const montserrat = Montserrat({ 
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const oxanium = Oxanium({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-oxanium',
});

export const dynamic = "force-dynamic";
interface GenerateMetadataParams {
  params: {
    locale?: string;
  };
}

async function getSystemSEOData() {
  try {
    const host = headers().get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const res = await fetch(`${protocol}://${host}/api/seo?system=true`);
    /* console.log('RES SEO', res) */
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSystemSEOData();
  const host = headers().get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase: metadataBase,
    title: seo?.title || "Portify - Your Free Online Portfolio - Your Portfolio, Your Identity",
    description:
      seo?.description ||
      "Create your professional portfolio with Portify - the platform that helps freelancers showcase their work and attract better clients.",
    keywords:
      seo?.keywords || ["Portify", "Free Online Portfolio", "Portfolio Builder", "Freelancer Portfolio", "Free Portfolio"],
    openGraph: {
      title: seo?.title || "Portify - Your Free Online Portfolio - Your Portfolio, Your Identity",
      description:
        seo?.description ||
        "Create your professional portfolio with Portify - the platform that helps freelancers showcase their work and attract better clients.",
      images: [{ url: seo?.ogImage || "https://agenciaaimagic.com.br/portify_logo_new_p.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || "Portify - Seu Portfólio, Sua Identidade",
      description:
        seo?.description ||
        "Create your professional portfolio with Portify. the platform that helps freelancers showcase their work and attract better clients.",
      images: [seo?.ogImage || "https://agenciaaimagic.com.br/portify_logo_new_p.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale || "en";
  return (
    <html lang={locale} className={`${oxanium.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className={`${montserrat.className}`}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <Navbar />
              {children}
              <Toaster />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
            <img src="//sstatic1.histats.com/0.gif?5033768&101" alt="cool hit counter" style={{ border: 0 }} />
        <Script id="histats-tracking" strategy="afterInteractive">
          {`
            var _Hasync= _Hasync|| [];
            _Hasync.push(['Histats.start', '1,5033768,4,0,0,0,00010000']);
            _Hasync.push(['Histats.fasi', '1']);
            _Hasync.push(['Histats.track_hits', '']);
            (function() {
              var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
              hs.src = ('//s10.histats.com/js15_as.js');
              (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
            })();
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9203W3HFCG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9203W3HFCG');
          `}
        </Script>
      </body>
    </html>
  );
}
