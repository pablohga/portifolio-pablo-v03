import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { headers } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });

async function getSEOData() {
  try {
    const host = headers().get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const res = await fetch(`${protocol}://${host}/api/seo`);
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOData();

  return {
    title: seo?.title || "Pablo Azevedo - Portfolio",
    description: seo?.description || "Full-stack developer portfolio showcasing creative and innovative projects",
    keywords: seo?.keywords || ["Pablo Azevedo", "Frontend Reactjs", "Frontend VueJS"],
    openGraph: {
      title: seo?.title || "Pablo Azevedo - Portfolio",
      description: seo?.description || "Full-stack developer portfolio showcasing creative and innovative projects",
      images: [{ url: seo?.ogImage || "/og-image.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || "Pablo Azevedo - Portfolio",
      description: seo?.description || "Full-stack developer portfolio showcasing creative and innovative projects",
      images: [seo?.ogImage || "/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}