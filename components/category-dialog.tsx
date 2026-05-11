"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./rich-text-editor";
import { Category } from "@/types/category";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

// ✅ Lista curada — ícones mais relevantes para categorias de portfólio
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

interface CategoryDialogProps {
  category?: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Category>) => void;
  maxOrder: number;
}

const getIcon = (iconName: string): LucideIcon =>
  (Icons[iconName as keyof typeof Icons] as LucideIcon) || Icons.Folder;

export function CategoryDialog({
  category, open, onOpenChange, onSubmit, maxOrder,
}: CategoryDialogProps) {
  const [search, setSearch] = useState("");

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", icon: "Folder", order: maxOrder + 1 },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
        icon: category.icon,
        order: category.order,
      });
    } else {
      form.reset({ name: "", description: "", icon: "Folder", order: maxOrder + 1 });
    }
    setSearch("");
  }, [category, open, maxOrder]);

  const selectedIcon = form.watch("icon");
  const SelectedIconComponent = getIcon(selectedIcon);

  // Filtra pela busca
  const filteredIcons = useMemo(() =>
    CURATED_ICONS.filter(name =>
      name.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  function handleSubmit(values: z.infer<typeof categorySchema>) {
    onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{category ? "Editar Categoria" : "Criar Categoria"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

            {/* Nome */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Aplicações Web" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Seletor de ícone com busca */}
            <FormField control={form.control} name="icon" render={({ field }) => (
              <FormItem>
                <FormLabel>Ícone</FormLabel>

                {/* Preview do ícone selecionado */}
                <div className="flex items-center gap-3 p-3 rounded-md border bg-muted/30">
                  {React.createElement(SelectedIconComponent, { className: "h-6 w-6" })}
                  <span className="text-sm font-medium">{field.value}</span>
                </div>

                {/* Campo de busca */}
                <Input
                  placeholder="Buscar ícone... ex: code, folder, chart"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="mt-2"
                />

                {/* Grid de ícones */}
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

            {/* Ordem */}
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

            {/* Descrição */}
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
      </DialogContent>
    </Dialog>
  );
}