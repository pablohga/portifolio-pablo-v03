"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Users } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { ProjectDialog } from "@/components/project-dialog";
import { CategoryDialog } from "@/components/category-dialog";
import { HeroDialog } from "@/components/hero-dialog";
import { SEODialog } from "@/components/seo-dialog";
import { AboutDialog } from "@/components/about-dialog";
import { ContactSettingsDialog } from "@/components/contact-settings-dialog";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { Hero } from "@/types/hero";
import { SEO } from "@/types/seo";
import { About } from "@/types/about";
import { formatName } from "@/lib/utils";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardContentProps {
  userId: string;
}

interface CategoryDialogProps {
  category?: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (category: Partial<Category>) => void;
  maxOrder: number;
}

export function DashboardContent({ userId }: DashboardContentProps) {
  const { data: session } = useSession();
  const { firstName, lastName } = formatName(session?.user?.name);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
  const [isSEODialogOpen, setIsSEODialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [isContactSettingsDialogOpen, setIsContactSettingsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchCategories(),
    ]).finally(() => setIsLoading(false));
  }, [userId]);

  async function fetchProjects() {
    try {
      const res = await fetch(`/api/projects?userId=${userId}`);
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

  async function fetchCategories() {
    try {
      const res = await fetch(`/api/categories?userId=${userId}`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  }

  async function handleCreateProject(data: Partial<Project>) {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      await fetchProjects();
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

  async function handleUpdateProject(data: Project) {
    try {
      const res = await fetch(`/api/projects/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      await fetchProjects();
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

  async function handleDeleteProject(id: string) {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      await fetchProjects();
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

  async function handleCreateCategory(data: Partial<Category>) {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      await fetchCategories();
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    }
  }

  async function handleUpdateCategory(data: Partial<Category>) {
    if (!data._id) {
      throw new Error("Category ID is required for updating.");
    }
  
    try {
      const res = await fetch(`/api/categories/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) throw new Error();
  
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteCategory(id: string) {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      await fetchCategories();
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  }

  async function handleUpdateHero(data: Partial<Hero>) {
    try {
      const res = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

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

  async function handleUpdateSEO(data: Partial<SEO>) {
    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

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

  async function handleUpdateAbout(data: Partial<About>) {
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

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

  async function handleUpdateContactSettings(data: any) {
    try {
      const res = await fetch("/api/contact/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Success",
        description: "Contact settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact settings",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-20">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Link 
              href={`/${session?.user?.name?.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center text-primary hover:underline"
            >
              View your public profile
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="text-lg font-medium">
            Welcome, {firstName} <span className="text-primary">{lastName}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setIsHeroDialogOpen(true)}>
            Edit Hero Section
          </Button>
          <Button onClick={() => setIsAboutDialogOpen(true)}>
            Edit About Section
          </Button>
          <Button onClick={() => setIsSEODialogOpen(true)}>
            Edit SEO Settings
          </Button>
          <Button onClick={() => setIsContactSettingsDialogOpen(true)}>
            Edit Contact Settings
          </Button>
          {session?.user?.role === 'admin' && (
            <Button asChild>
              <Link href="/dashboard/users" className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                Manage Users
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Button onClick={() => {
            setSelectedCategory(null);
            setIsCategoryDialogOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category._id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    {category.description && (
                      <div 
                        className="text-muted-foreground prose prose-sm dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: category.description }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this category? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Button onClick={() => setIsProjectDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={handleUpdateProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      </div>

      <ProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onSubmit={handleCreateProject}
      />

      <CategoryDialog
        category={selectedCategory || undefined}
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSubmit={selectedCategory ? handleUpdateCategory : handleCreateCategory}
        maxOrder={Math.max(...categories.map((c) => c.order), -1)}
      />

      <HeroDialog
        userId={userId}
        open={isHeroDialogOpen}
        onOpenChange={setIsHeroDialogOpen}
        onSubmit={handleUpdateHero}
      />

      <SEODialog
        userId={userId}
        open={isSEODialogOpen}
        onOpenChange={setIsSEODialogOpen}
        onSubmit={handleUpdateSEO}
      />

      <AboutDialog
        userId={userId}
        open={isAboutDialogOpen}
        onOpenChange={setIsAboutDialogOpen}
        onSubmit={handleUpdateAbout}
      />

      <ContactSettingsDialog
        userId={userId}
        open={isContactSettingsDialogOpen}
        onOpenChange={setIsContactSettingsDialogOpen}
        onSubmit={handleUpdateContactSettings}
      />
    </div>
  );
}