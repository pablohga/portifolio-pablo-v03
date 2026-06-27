"use client";

import { useState, useEffect, ComponentType } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ExternalLink, Settings, Trash2, Pencil } from "lucide-react";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { Testimonial } from "@/types/testimonial";
import { formatName } from "@/lib/utils";
import { SubscriptionBadge } from "@/components/subscription-badge";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TemplateProvider } from "@/components/template-context";
import { TemplateSelector } from "@/components/template-selector";
import { HeroEditor } from "@/components/dashboard-editors/hero-editor";
import { AboutEditor } from "@/components/dashboard-editors/about-editor";
import { CategoryEditor } from "@/components/dashboard-editors/category-editor";
import { ProjectEditor } from "@/components/dashboard-editors/project-editor";
import { TestimonialEditor } from "@/components/dashboard-editors/testimonial-editor";
import { SEOEditor } from "@/components/dashboard-editors/seo-editor";
import { ContactSettingsEditor } from "@/components/dashboard-editors/contact-settings-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SEOEditorComponent = SEOEditor as unknown as ComponentType<{
  userId: string;
  onSubmit: (data: any) => Promise<void>;
}>;

interface DashboardContentProps {
  userId: string;
}

export function DashboardContent({ userId }: DashboardContentProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const { firstName, lastName } = formatName(session?.user?.name);
  const { toast } = useToast();
  const { t, ready } = useTranslation();

  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchCategories(),
      fetchTestimonials(),
    ]).finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return <p>Loading...</p>;
  }

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

  async function fetchTestimonials() {
    try {
      const res = await fetch(`/api/testimonials?userId=${userId}`);
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      });
    }
  }

  async function handleCreateTestimonial(data: Testimonial) {
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      await fetchTestimonials();
      setEditingTestimonialId(null);
      toast({
        title: "Success",
        description: "Testimonial saved successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteTestimonial(id: string) {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await fetchTestimonials();
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  }

  async function handleUpdateHero(data: any) {
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
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hero section",
        variant: "destructive",
      });
    }
  }

  async function handleUpdateSEO(data: any) {
    try {
      setIsLoading(true);

      const response = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: session?.user?.id }),
      });

      if (!response.ok) throw new Error("Failed to update SEO settings");

      toast({
        title: "Success",
        description: "SEO settings updated successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update SEO settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateAbout(data: any) {
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
        variant: "success",
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
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact settings",
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
      setEditingProjectId(null);
      toast({
        title: "Success",
        description: "Project saved successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteProject(id: string | null) {
    if (!id) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await fetchProjects();
      toast({
        title: "Success",
        description: "Project deleted successfully",
        variant: "success",
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
      setEditingCategoryId(null);
      toast({
        title: "Success",
        description: "Category saved successfully",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
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
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 max-w-[960px]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <TemplateProvider>
      <div className="space-y-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{t("Dashboard.title")}</h1>
            <Link
              href={`/${session?.user?.slug?.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center text-primary hover:underline"
            >
              {t("Dashboard.ViewYourPortfolio")}
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="text-lg font-medium">
              {t("Dashboard.Welcome")}, {firstName} <span className="text-primary">{lastName}</span>
            </div>
            <SubscriptionBadge tier={session?.user?.subscriptionTier || 'free'} />
          </div>
        </div>

        <div className="min-h-[600px]">
          {currentTab === 'templates' && (
            <div className="my-10">
              <TemplateSelector/>
            </div>
          )}
          {currentTab === 'hero' && <HeroEditor userId={userId} onSubmit={handleUpdateHero} />}
          {currentTab === 'about' && <AboutEditor userId={userId} onSubmit={handleUpdateAbout} />}

          {currentTab === 'categories-add' && (
            <div className="space-y-10">
              <CategoryEditor
                onSubmit={handleCreateCategory}
                maxOrder={Math.max(...categories.map((c) => c.order), -1)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{categories.map((cat) => (
                  <div key={cat._id} className="p-4 border rounded-lg flex justify-between items-center bg-card">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-md">
                        <span className="text-xs font-medium">{cat.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-sm">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">Ordem: {cat.order}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingCategoryId(cat._id)}>
                        <Pencil className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(cat._id)}>
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'categories-edit' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <Dialog key={cat._id}>
                    <DialogTrigger asChild>
                      <div className="p-4 border rounded-lg flex justify-between items-center bg-card cursor-pointer hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-md">
                            <span className="text-xs font-medium">{cat.icon}</span>
                          </div>
                          <div className="flex flex-col">
                            <p className="font-medium text-sm">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">Ordem: {cat.order}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-3 w-3 mr-1" /> Edit
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <CategoryEditor
                        category={cat}
                        onSubmit={handleCreateCategory}
                        maxOrder={Math.max(...categories.map((c) => c.order), -1)}
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                   <Button
                    key={cat._id}
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCategory(cat._id)}
                   >
                     Delete {cat.name}
                   </Button>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'projects-add' && (
            <div className="space-y-10">
              <ProjectEditor
                categories={categories}
                onSubmit={handleCreateProject}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <div key={proj._id} className="p-4 border rounded-lg flex flex-col gap-3 bg-card h-full">
                    <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={proj.image}
                        alt={proj.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <p className="font-medium text-sm">{proj.title}</p>
                        <p className="text-xs text-muted-foreground">{proj.year}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingProjectId(proj._id)}>
                          <Pencil className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(proj._id)}>
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {proj.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'projects-edit' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <Dialog key={proj.id}>
                    <DialogTrigger asChild>
                      <div className="p-4 border rounded-lg flex flex-col gap-3 bg-card cursor-pointer hover:bg-accent/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <p className="font-medium text-sm">{proj.title}</p>
                            <p className="text-xs text-muted-foreground">{proj.year}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3 w-3 mr-1" /> Edit
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {proj.description}
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                      </DialogHeader>
                      <ProjectEditor
                        project={proj}
                        categories={categories}
                        onSubmit={handleCreateProject}
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {projects.map((proj) => (
                   <Button
                    key={proj._id}
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProject(proj._id)}
                   >
                     Delete {proj.title}
                   </Button>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'testimonials' && (
            <div className="space-y-10">
              <TestimonialEditor
                testimonial={testimonials.find(t => t._id === editingTestimonialId)}
                onSubmit={handleCreateTestimonial}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((testimonial) => (
                  <Dialog key={testimonial._id}>
                    <DialogTrigger asChild>
                      <div className="p-4 border rounded-lg flex flex-col gap-3 bg-card cursor-pointer hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border bg-muted shrink-0">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <p className="font-medium text-sm truncate">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{testimonial.role}</p>
                          </div>
                          <Button variant="outline" size="sm" className="ml-auto">
                            <Pencil className="h-3 w-3 mr-1" /> Edit
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-3 italic mt-2">
                          &quot;{testimonial.text}&quot;
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Testimonial</DialogTitle>
                      </DialogHeader>
                      <TestimonialEditor
                        testimonial={testimonial}
                        onSubmit={handleCreateTestimonial}
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {testimonials.map((testimonial) => (
                   <Button
                    key={testimonial._id}
                    variant="destructive"
                    size="sm"
                    onClick={() => testimonial._id && handleDeleteTestimonial(testimonial._id)}
                   >
                     Delete {testimonial.name}
                   </Button>
                ))}
              </div>
            </div>
          )}
          {currentTab === 'seo' && <SEOEditorComponent userId={userId} onSubmit={handleUpdateSEO} />}
          {currentTab === 'contact' && <ContactSettingsEditor userId={userId} onSubmit={handleUpdateContactSettings} />}
          {!currentTab && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <Settings className="h-12 w-12 text-muted-foreground animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Bem-vindo ao seu painel de controle</h2>
                <p className="text-muted-foreground max-w-md">
                  Selecione uma opção no menu lateral para começar a personalizar seu portfólio.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </TemplateProvider>
  );
}
