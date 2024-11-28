import { notFound } from "next/navigation";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";

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

export async function generateMetadata({ params }: Props) {
  const user = await getUser(params.username);
  
  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${user.name} - Portfolio`,
    description: `${user.name}'s portfolio showcasing their projects and skills`,
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