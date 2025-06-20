"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Users, Home, UserCircle, DollarSign } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { ProjectDialog } from "@/components/project-dialog";
import { CategoryDialog } from "@/components/category-dialog";
import { HeroDialog } from "@/components/hero-dialog";
import { SEODialog } from "@/components/seo-dialog";
import { AboutDialog } from "@/components/about-dialog";
import { ContactSettingsDialog } from "@/components/contact-settings-dialog";
import { HomeEditorDialog } from "@/components/home-editor-dialog_edited";
import { PaymentPlansDialog } from "@/components/payment-plans-dialog";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { formatName } from "@/lib/utils";
import { SubscriptionBadge } from "@/components/subscription-badge";
import { Settings } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { TemplateProvider } from "@/components/template-context";
import { TemplateSelector } from "@/components/template-selector";
/* import { fetchSubscritionByEmail } from "@/lib/stripe"; */

interface DashboardContentProps {
  userId: string;
}

export function DashboardContent({ userId }: DashboardContentProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
  const [isSEODialogOpen, setIsSEODialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [isContactSettingsDialogOpen, setIsContactSettingsDialogOpen] = useState(false);
  const [isHomeEditorOpen, setIsHomeEditorOpen] = useState(false);
  const [isPaymentPlansOpen, setIsPaymentPlansOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { data: session } = useSession();
  const { firstName, lastName } = formatName(session?.user?.name);
  const { toast } = useToast();
  const userEmail = session?.user?.email as string
  const { t, ready } = useTranslation();


  useEffect(() => {
      Promise.all([
      fetchProjects(),
      fetchCategories(),
      /* fetchSubscritionByEmail(userEmail) */
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
  
      // Include the userId in the payload
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

  async function handleUpdateHome(data: any) {
    try {
      const res = await fetch("/api/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Success",
        description: "Home page updated successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update home page",
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
        variant: "success",
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
        variant: "success",
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
      toast({
        title: "Success",
        description: "Category created successfully",
        variant: "success",
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
        variant: "success",
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
      <div className="container mx-auto py-20 max-w-[960px]">
        <TemplateSelector />
        <div className="mb-8 space-y-4">
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
              <Button variant="outline" asChild>
                <Link href="/dashboard/profile" className="inline-flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {t("Dashboard.ProfileSettings")}
                </Link>
              </Button>
              <div className="text-lg font-medium">
              {t("Dashboard.Welcome")}, {firstName} <span className="text-primary">{lastName}</span>
              </div>
                <SubscriptionBadge tier={session?.user?.subscriptionTier || 'free'} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setIsHeroDialogOpen(true)}>
              {t("Dashboard.EditHeroBannerSection")}
            </Button>
            <Button onClick={() => setIsAboutDialogOpen(true)}>
              {t("Dashboard.EditSectionAboutYou")}
            </Button>
            <Button onClick={() => setIsSEODialogOpen(true)}>
              {t("Dashboard.EditSeoSettings")}
            </Button>
            <Button onClick={() => setIsContactSettingsDialogOpen(true)}>
              {t("Dashboard.EditContactSettings")}
            </Button>
            {session?.user?.subscriptionTier === 'premium' && (
              <Button asChild>
                <Link href="/dashboard/clients" className="inline-flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  {t("Dashboard.ManageCustomers")}
                </Link>
              </Button>
            )}
            {session?.user?.role === 'admin' && (
              <>
                <Button onClick={() => setIsHomeEditorOpen(true)}>
                  <Home className="mr-2 h-4 w-4" />
                  {t("Dashboard.HomePageEdit")}
                </Button>
                <Button onClick={() => setIsPaymentPlansOpen(true)}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  {t("Dashboard.PaymentPlans")}
                </Button>
                <Button asChild>
                  <Link href="/dashboard/users" className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t("Dashboard.ManagePortifyUsers")}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {t("Dashboard.Categories")}
            </h2>
            <Button onClick={() => {
              setSelectedCategory(null);
              setIsCategoryDialogOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {t("Dashboard.AddCategories")}
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
                      {t("Dashboard.Edit")}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          {t("Dashboard.Delete")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("Dashboard.DeleteCategory")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("Dashboard.DeleteThisCategory")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("Dashboard.Cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t("Dashboard.Delete")}
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
            <h2 className="text-2xl font-bold">
              {t("Dashboard.Projects")}
            </h2>
            <Button onClick={() => setIsProjectDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t("Dashboard.AddProjects")}
            </Button>
          </div>

        <Tabs defaultValue={categories[0]?.id} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-transparent">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter((project) => project.category === category.id)
                  .map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onEdit={handleUpdateProject}
                      onDelete={handleDeleteProject}
                    />
                  ))}
              </div>
              {projects.filter((project) => project.category === category.id).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  {t("Dashboard.NoProjects")}
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
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

      <HomeEditorDialog
        open={isHomeEditorOpen}
        onOpenChange={setIsHomeEditorOpen}
        onSubmit={handleUpdateHome}
      />

      <PaymentPlansDialog
        open={isPaymentPlansOpen}
        onOpenChange={setIsPaymentPlansOpen}
      />
    </div>
    </TemplateProvider>
  );
}