import { notFound } from "next/navigation";
import { User } from "@/models/user";
import { Project } from "@/models/project";
import dbConnect from "@/lib/db";
import HeroSection from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { SEO } from "@/models/seo";
import { Category } from "@/models/category";
import { Metadata } from "next";
import Template1 from "@/components/templates/Template1";
import Template2 from "@/components/templates/Template2";
import Template3 from "@/components/templates/Template3";
import Template4 from "@/components/templates/Template4";
import Template5 from "@/components/templates/Template5";
import Template6 from "@/components/templates/Template6";
import Template7 from "@/components/templates/Template7";
import Template8 from "@/components/templates/Template8";
import Template9 from "@/components/templates/Template9";
import Template10 from "@/components/templates/Template10";
import Template11 from "@/components/templates/Template11";
import Template12 from "@/components/templates/Template12";
import Template13 from "@/components/templates/Template13";
import Template14 from "@/components/templates/Template14";
import Template15 from "@/components/templates/Template15";
import Template16 from "@/components/templates/Template16";
import Template17 from "@/components/templates/Template17";

interface UserPortfolioPageProps {
  params: {
    slug: string;
  };
}

async function getUser(slug: string) {
  await dbConnect();
  return User.findOne({ slug });
}

async function getUserSEO(userId: string) {
  return SEO.findOne({ userId }).sort({ createdAt: -1 });
}

async function getUserCategories(userId: string) {
  return Category.find({ userId }).sort({ order: 1 });
}

async function getUserProjects(userId: string) {
  return Project.find({ userId }).sort({ createdAt: -1 });
}

export async function generateMetadata({ params }: UserPortfolioPageProps): Promise<Metadata> {
  const user = await getUser(params.slug);

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  const seo = await getUserSEO(user._id.toString());

  // Resolve base URL for metadataBase (Metadata.metadataBase expects a URL)
  const host = await import("next/headers").then(h => h.headers().get("host") || "localhost:3000");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: seo?.title || `${user.name} - Portfolio`,
    description:
      seo?.description || `${user.name}'s portfolio showcasing their projects and skills`,
    keywords: seo?.keywords || [],
    openGraph: {
      title: seo?.title || `${user.name} - Portfolio`,
      description:
        seo?.description || `${user.name}'s portfolio showcasing their projects and skills`,
      images: [{ url: seo?.ogImage || "/og-image.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || `${user.name} - Portfolio`,
      description:
        seo?.description || `${user.name}'s portfolio showcasing their projects and skills`,
      images: [seo?.ogImage || "/og-image.jpg"],
    },
  };
}

export default async function UserPortfolioPage({
  params,
}: UserPortfolioPageProps) {
  const user = await getUser(params.slug);

  if (!user) {
    return notFound();
  }

  const userId = user._id.toString();
  const [categories, projects] = await Promise.all([
    getUserCategories(userId),
    getUserProjects(userId),
  ]);

  // Determine which template to render based on user's portfolioTemplate
  const template = user.portfolioTemplate || "default";

  type TemplateComponentProps = {
    userId: string;
    categories: any[];
    projects: any[];
    userImage?: string;
    userName?: string;
  };

  let TemplateComponent: React.ComponentType<TemplateComponentProps> | null = null;
  switch (template) {
    case "template1":
      TemplateComponent = Template1;
      break;
    case "template2":
      TemplateComponent = Template2;
      break;
    case "template3":
      TemplateComponent = Template3;
      break;
    case "template4":
      TemplateComponent = Template4;
      break;
    case "template5":
      TemplateComponent = Template5;
      break;
    case "template6":
      TemplateComponent = Template6;
      break;
    case "template7":
      TemplateComponent = Template7;
      break;
    case "template8":
      TemplateComponent = Template8;
      break;
    case "template9":
      TemplateComponent = Template9;
      break;
    case "template10":
      TemplateComponent = Template10;
      break;
    case "template11":
      TemplateComponent = Template11;
      break;
    case "template12":
      TemplateComponent = Template12;
      break;
    case "template13":
      TemplateComponent = Template13;
      break;
    case "template14":
      TemplateComponent = Template14;
      break;
    case "template15":
      TemplateComponent = Template15;
      break;
    case "template16":
      TemplateComponent = Template16;
      break;
    case "template17":
      TemplateComponent = Template17;
      break;
    default:
      TemplateComponent = null;
  }

  return (
    <div className="min-h-screen bg-background">
      {TemplateComponent ? (
        <TemplateComponent
          userId={userId}
          categories={categories}
          projects={projects}
          userImage={user.image}
          userName={user.name}
        />
      ) : (
        <>
          <HeroSection userId={userId} />
          <AboutSection userId={userId} />
          <ProjectsSection userId={userId} initialCategories={categories} initialProjects={projects} />
          <ContactSection userId={userId} />
        </>
      )}
    </div>
  );
}
