"use client";

import React, { useState } from "react";
import { useTemplate, type TemplateType } from "./template-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const templates = [
  { id: "default", name: "Default" },
  { id: "template1", name: "Template 1" },
  { id: "template2", name: "Template 2" },
  { id: "template3", name: "Template 3" },
  { id: "template4", name: "Template 4" },
  { id: "template5", name: "Template 5" },
  { id: "template6", name: "Template 6" },
  { id: "template7", name: "Template 7" },
  { id: "template8", name: "Template 8" },
  { id: "template9", name: "Template 9" },
  { id: "template10", name: "Template 10" },
  { id: "template11", name: "Template 11" },
  { id: "template12", name: "Template 12" },
  { id: "template13", name: "Template 13" },
  { id: "template14", name: "Template 14" },
  { id: "template15", name: "Template 15" },
  { id: "template16", name: "Template 16" },
  { id: "template17", name: "Template 17" }
];

export function TemplateSelector() {
  const { template, setTemplate } = useTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(template);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setSelectedTemplate(template);
  }, [template]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const success = await setTemplate(selectedTemplate);
      if (success) {
        toast.success("Template atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar o template. Por favor, tente novamente.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado ao salvar o template.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-semibold">
        Selecione o Template do seu Portfólio:
      </label>
      <div className="flex flex-row flex-wrap gap-4 mb-4">
        {templates.map((t) => (
          <label key={t.id} className="inline-flex items-center space-x-2 cursor-pointer">
            <div className="flex flex-col gap-4 mb-4 p-2 border rounded-lg hover:bg-accent/50 transition-colors relative">
                <Image
                  src={t.id === "default" ? "/images/templates-thumbs/default.png" : `/images/templates-thumbs/${t.name}.png`}
                  alt={t.name}
                  width={120}
                  height={52}
                  priority
                  className="logo-img object-cover rounded-md max-h-64 object-top"
                />
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="template"
                  value={t.id}
                  checked={selectedTemplate === t.id}
                  onChange={() => setSelectedTemplate(t.id as TemplateType)}
                  className="form-radio"
                />
                <span className="text-sm font-medium">{t.name}</span>
                {template === t.id && (
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-green-500 text-white">
                    Ativo
                  </span>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gravando...
          </>
        ) : (
          "Gravar"
        )}
      </Button>
    </div>
  );
}
