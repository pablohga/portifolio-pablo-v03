import { notFound } from "next/navigation";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { SEO } from "@/models/seo";

interface Props {
  params: {
    username: string;
  };
}

async function getUser(username: string) {
  await dbConnect();
  const formattedUsername = username.replace(/-/g, " ");
  return User.findOne({ name: new RegExp(`^${formattedUsername}$`, "i") });
}

async function getUserSEO(userId: string) {
  return SEO.findOne({ userId }).sort({ createdAt: -1 });
}

export async function generateMetadata({ params }: Props) {
  const user = await getUser(params.username);
  
  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  const seo = await getUserSEO(user._id.toString());

  return {
    title: seo?.title || `${user.name} - Portfolio`,
    description: seo?.description || `${user.name}'s portfolio showcasing their projects and skills`,
    keywords: seo?.keywords || [],
    openGraph: {
      title: seo?.title || `${user.name} - Portfolio`,
      description: seo?.description || `${user.name}'s portfolio showcasing their projects and skills`,
      images: [{ url: seo?.ogImage || "/og-image.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || `${user.name} - Portfolio`,
      description: seo?.description || `${user.name}'s portfolio showcasing their projects and skills`,
      images: [seo?.ogImage || "/og-image.jpg"],
    },
  };
}

export default async function UserPortfolioPage({ params }: Props) {
  const user = await getUser(params.username);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection userId={user._id.toString()} />
      <ProjectsSection userId={user._id.toString()} />
      <AboutSection userId={user._id.toString()} />
      <ContactSection userId={user._id.toString()} />
    </div>
  );
}