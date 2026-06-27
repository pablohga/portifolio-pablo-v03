"use client"; 

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "../rich-text-editor";
import { Category } from "@/types/category";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const CURATED_ICONS = [
  "Folder", "FolderOpen", "Code", "Code2", "CodeSquare",
  "Globe", "Monitor", "Smartphone", "Tablet", "Laptop",
  "Layout", "LayoutGrid", "LayoutDashboard", "AppWindow",
  "Palette", "Paintbrush", "PenTool", "Pencil", "Brush",
  "Image", "Images", "Camera", "Video", "Film",
  "ShoppingCart", "ShoppingBag", "Store", "Package",
  "BarChart", "BarChart2", "LineChart", "PieChart", "TrendingUp",
  "Briefcase", "Building", "Building2", "Factory",
  "Users", "User", "UserCircle", "Contact",
  "Mail", "MessageSquare", "MessageCircle", "Send",
  "Settings", "Wrench", "Tool", "Cog", "Cpu",
  "Database", "Server", "Cloud", "HardDrive",
  "Lock", "Shield", "Key", "Fingerprint",
  "Star", "Heart", "Bookmark", "Flag", "Award", "Trophy",
  "Zap", "Rocket", "Lightbulb", "Sparkles", "Wand2",
  "Music", "Headphones", "Mic", "Radio",
  "Map", "MapPin", "Navigation", "Compass",
  "Book", "BookOpen", "GraduationCap", "School",
  "Search", "Link", "ExternalLink", "Share2",
  "Download", "Upload", "FileText", "File", "Files",
  "Home", "Car", "Plane", "Train",
  "Sun", "Moon", "Cloud", "Leaf", "Flower",
];

const categorySchema = z.object({
  name:        z.string().min(2, "Mínimo 2 caracteres"),
  description: z.string().optional(),
  icon:        z.string(),
  order:       z.number().min(0),
});

interface CategoryEditorProps {
  category?: Category;
  onSubmit: (data: Partial<Category>) => void;
  maxOrder: number;
}

const getIcon = (iconName: string): LucideIcon =>
  (Icons[iconName as keyof typeof Icons] as LucideIcon) || Icons.Folder;

export function CategoryEditor({
  category, onSubmit, maxOrder,
}: CategoryEditorProps) {
  const [search, setSearch] = useState("");

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      icon: category?.icon || "Folder",
      order: category?.order !== undefined ? category.order : maxOrder + 1
    },
  });

  const selectedIcon = form.watch("icon");
  const SelectedIconComponent = getIcon(selectedIcon);

  const filteredIcons = useMemo(() =>
    CURATED_ICONS.filter(name =>
      name.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  function handleSubmit(values: z.infer<typeof categorySchema>) {
    onSubmit(values);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">{category ? "Editar Categoria" : "Criar Categoria"}</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Categoria</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Aplicações Web" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="icon" render={({ field }) => (
            <FormItem>
              <FormLabel>Ícone</FormLabel>

              <div className="flex items-center gap-3 p-3 rounded-md border bg-muted/30">
                {React.createElement(SelectedIconComponent, { className: "h-6 w-6" })}
                <span className="text-sm font-medium">{field.value}</span>
              </div>

              <Input
                placeholder="Buscar ícone... ex: code, folder, chart"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mt-2"
              />

              <div className="grid grid-cols-6 gap-1 h-[220px] overflow-y-auto border rounded-md p-2 mt-1">
                {filteredIcons.map(iconName => {
                  const IconComp = getIcon(iconName);
                  const isSelected = field.value === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      title={iconName}
                      onClick={() => field.onChange(iconName)}
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-md text-xs transition-colors hover:bg-muted
                        ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary" : ""}`}
                    >
                      {React.createElement(IconComp, { className: "h-5 w-5" })}
                      <span className="truncate w-full text-center" style={{ fontSize: "9px" }}>
                        {iconName}
                      </span>
                    </button>
                  );
                })}
                {filteredIcons.length === 0 && (
                  <div className="col-span-6 text-center text-muted-foreground text-sm py-4">
                    Nenhum ícone encontrado
                  </div>
                )}
              </div>

              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="order" render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem de Exibição</FormLabel>
              <FormControl>
                <Input
                  type="number" min="0" {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>Números menores aparecem primeiro</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição <span className="text-muted-foreground text-xs">(opcional)</span></FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Descrição da categoria..."
                />
              </FormControl>
              <FormDescription>Este texto aparece acima dos projetos da categoria</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="w-full">Salvar Categoria</Button>
        </form>
      </Form>
    </div>
  );
}