import { Metadata } from "next";
/* import { Inter } from "next/font/google"; */
import { Montserrat, Oxanium } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";
import LanguageProvider from "@/components/LanguageProvider";

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
    /* console.log('seo?.title',seo?.title) */
  return {
    
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
      </body>
    </html>
  );
}
