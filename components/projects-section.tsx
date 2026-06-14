"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Folder } from "lucide-react";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDetailsModal } from "@/components/project-details-modal";
import * as Icons from "lucide-react";

interface ProjectsSectionProps {
  userId?: string;
  initialCategories?: Category[];
  initialProjects?: Project[];
  title?: string;
}

const ITEMS_PER_PAGE = 6;

export function ProjectsSection({ userId, initialCategories = [], initialProjects = [], title = "Meus Projetos" }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(!initialProjects.length || !initialCategories.length);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!initialProjects.length || !initialCategories.length) {
      Promise.all([
        fetchProjects(),
        !initialCategories.length && fetchCategories(),
      ].filter(Boolean)).finally(() => setIsLoading(false));
    } else {
      const pages: Record<string, number> = {};
      initialCategories.forEach((category) => {
        pages[category.id] = 1;
      });
      setCurrentPage(pages);
    }
  }, [userId, initialCategories, initialProjects]);

  async function fetchProjects() {
    try {
      const url = userId ? `/api/projects?userId=${userId}` : "/api/projects";
      const response = await fetch(url);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }

  async function fetchCategories() {
    if (initialCategories.length > 0) {
      setCategories(initialCategories);
      return;
    }

    try {
      const url = userId ? `/api/categories?userId=${userId}` : "/api/categories";
      const response = await fetch(url);
      const data = await response.json();
      const sortedCategories = data.sort((a: Category, b: Category) => a.order - b.order);
      setCategories(sortedCategories);

      const pages: Record<string, number> = {};
      sortedCategories.forEach((category: Category) => {
        pages[category.id] = 1;
      });
      setCurrentPage(pages);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  const getPageCount = (categoryId: string) => {
    const categoryProjects = projects.filter(project => project.category === categoryId);
    return Math.ceil(categoryProjects.length / ITEMS_PER_PAGE);
  };

  const getPaginatedProjects = (categoryId: string) => {
    const categoryProjects = projects.filter(project => project.category === categoryId);
    const startIndex = (currentPage[categoryId] - 1) * ITEMS_PER_PAGE;
    return categoryProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const handlePageChange = (categoryId: string, delta: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [categoryId]: Math.max(1, Math.min(prev[categoryId] + delta, getPageCount(categoryId)))
    }));
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  if (isLoading || categories.length === 0) {
    return (
      <section id="projects" className="py-24 bg-background">
        <div className="container px-4 mx-auto">
        {/* <div className="container px-4 mx-auto max-w-[1100px]"> */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Projects</h2>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container px-4 mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-lg mx-auto">
            Uma curadoria do meu trabalho mais recente.
          </p>
        </motion.div>

        <Tabs defaultValue={categories[0]?.id} id="projects-tabs" className="w-full">
          <TabsList id="tab-list" className="flex flex-wrap justify-center h-auto p-1 bg-muted/50 backdrop-blur-sm rounded-full mb-12 max-w-fit mx-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                id="tab-trigger"
                className="rounded-full px-6 py-2 data-[state=active]:bg-[#5221e6] data-[state=active]:text-white transition-all duration-300"
              >
                <span className="text-sm font-medium">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="outline-none">
              {category.description && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-sm dark:prose-invert max-w-none mb-12 text-center text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: category.description }}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-20">
                <AnimatePresence mode="popLayout">
                  {getPaginatedProjects(category.id).map((project, index) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      onClick={() => handleProjectClick(project)}
                      className="group cursor-pointer"
                    >
                      <div id="card-projects-wrapper" className="p-10 relative h-full rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-[#5221e6]/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#5221e6]/20">
                        <div id="card-projects" className="aspect-video relative overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div id="card-projects-content" className="p-10">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-[#5221e6] transition-colors duration-300">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {project.description}
                          </p>
                          <div id="card-projects-tags" className="flex gap-2 flex-wrap">
                            {project.tech.map((tech, techIndex) => (
                              <span
                                id="card-projects-tags-item"
                                key={techIndex}
                                className="px-2.5 py-0.5 bg-[#5221e6]/10 text-[#5221e6] rounded-full text-xs font-medium border border-[#5221e6]/20"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {getPageCount(category.id) > 1 && (
                <div className="mt-12 flex items-center justify-center gap-6">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10"
                    onClick={() => handlePageChange(category.id, -1)}
                    disabled={currentPage[category.id] === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Página {currentPage[category.id]} de {getPageCount(category.id)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10"
                    onClick={() => handlePageChange(category.id, 1)}
                    disabled={currentPage[category.id] === getPageCount(category.id)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <ProjectDetailsModal
          project={selectedProject}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </section>
  );
}
