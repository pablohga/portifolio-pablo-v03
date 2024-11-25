"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "@/components/project-dialog";
import { ProjectCard } from "@/components/project-card";
import { HeroDialog } from "@/components/hero-dialog";
import { SEODialog } from "@/components/seo-dialog";
import { AboutDialog } from "@/components/about-dialog";
import { Project } from "@/types/project";
import { Hero } from "@/types/hero";
import { SEO } from "@/types/seo";
import { About } from "@/types/about";
import { Plus, Layout, Search, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  { id: "sites", name: "Sites" },
  { id: "social", name: "Redes Sociais" },
  { id: "apps", name: "Aplicativos" },
];

export function DashboardContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hero, setHero] = useState<Hero | null>(null);
  const [seo, setSEO] = useState<SEO | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isHeroOpen, setIsHeroOpen] = useState(false);
  const [isSEOOpen, setIsSEOOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchHero(),
      fetchSEO(),
      fetchAbout(),
    ]).finally(() => setIsLoading(false));
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    }
  }

  async function fetchHero() {
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      if (data._id) {
        setHero(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hero data",
        variant: "destructive",
      });
    }
  }

  async function fetchSEO() {
    try {
      const res = await fetch("/api/seo");
      const data = await res.json();
      if (data._id) {
        setSEO(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch SEO data",
        variant: "destructive",
      });
    }
  }

  async function fetchAbout() {
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data._id) {
        setAbout(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch about data",
        variant: "destructive",
      });
    }
  }

  async function handleSEOSubmit(data: Partial<SEO>) {
    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      const updatedSEO = await res.json();
      setSEO(updatedSEO);
      toast({
        title: "Success",
        description: "SEO settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update SEO settings",
        variant: "destructive",
      });
    }
  }

  async function handleHeroSubmit(data: Partial<Hero>) {
    try {
      const res = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      const updatedHero = await res.json();
      setHero(updatedHero);
      toast({
        title: "Success",
        description: "Hero section updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hero section",
        variant: "destructive",
      });
    }
  }

  async function handleAboutSubmit(data: Partial<About>) {
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      const updatedAbout = await res.json();
      setAbout(updatedAbout);
      toast({
        title: "Success",
        description: "About section updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update about section",
        variant: "destructive",
      });
    }
  }

  async function handleCreate(project: Partial<Project>) {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (!res.ok) throw new Error();

      const newProject = await res.json();
      setProjects([newProject, ...projects]);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  }

  async function handleEdit(project: Project) {
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (!res.ok) throw new Error();

      const updatedProject = await res.json();
      setProjects(
        projects.map((p) => (p._id === project._id ? updatedProject : p))
      );
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setProjects(projects.filter((p) => p._id !== id));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[400px] rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsSEOOpen(true)} variant="outline">
            <Search className="mr-2 h-4 w-4" /> Edit SEO
          </Button>
          <Button onClick={() => setIsHeroOpen(true)} variant="outline">
            <Layout className="mr-2 h-4 w-4" /> Edit Hero
          </Button>
          <Button onClick={() => setIsAboutOpen(true)} variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Edit About
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sites" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((project) => project.category === category.id)
                .map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ProjectDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
      />

      <HeroDialog
        hero={hero || undefined}
        open={isHeroOpen}
        onOpenChange={setIsHeroOpen}
        onSubmit={handleHeroSubmit}
      />

      <SEODialog
        seo={seo || undefined}
        open={isSEOOpen}
        onOpenChange={setIsSEOOpen}
        onSubmit={handleSEOSubmit}
      />

      <AboutDialog
        about={about || undefined}
        open={isAboutOpen}
        onOpenChange={setIsAboutOpen}
        onSubmit={handleAboutSubmit}
      />
    </div>
  );
}