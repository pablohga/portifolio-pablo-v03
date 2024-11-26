"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDetailsModal } from "@/components/project-details-modal";

const ITEMS_PER_PAGE = 6;

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchCategories()
    ]).finally(() => setIsLoading(false));
  }, []);

  async function fetchProjects() {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
      // Initialize pagination for each category
      const pages: Record<string, number> = {};
      data.forEach((category: Category) => {
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
      <section id="projects" className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Projects</h2>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Projects</h2>
          <p className="text-muted-foreground">Some of my recent work</p>
        </motion.div>

        <Tabs defaultValue={categories[0]?.id} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              {category.description && (
                <div 
                  className="prose dark:prose-invert max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: category.description }}
                />
              )}
              
              <div className="grid md:grid-cols-3 gap-8">
                {getPaginatedProjects(category.id).map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    onClick={() => handleProjectClick(project)}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden hover:shadow-lg hover:shadow-[#5221e6]/10 transition-all duration-300">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 flex-wrap">
                          {project.tech.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-[#5221e6]/10 text-[#5221e6] rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {getPageCount(category.id) > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(category.id, -1)}
                    disabled={currentPage[category.id] === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage[category.id]} of {getPageCount(category.id)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
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