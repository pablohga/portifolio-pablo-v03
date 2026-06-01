"use client";

import React, { useState } from "react";
import { useTemplate } from "./template-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const templates = [
  { id: "default", name: "Default" },
  { id: "template1", name: "Template 1" },
  { id: "template2", name: "Template 2" },
  { id: "template3", name: "Template 3" },
];

export function TemplateSelector() {
  const { template, setTemplate } = useTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<"default" | "template1" | "template2" | "template3">(template);
  const [isLoading, setIsLoading] = useState(false);

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
      <div className="flex flex-row gap-4 mb-4">
        {templates.map((t) => (
          <label key={t.id} className="inline-flex items-center space-x-2">
            
            <div className="flex flex-col gap-4 mb-4">
              <Image
              src={`https://agenciaaimagic.com.br/portify/${t.name}.png`}
              alt="Portify"
              width={120}
              height={52}
              priority
              className="logo-img"/>
              <div>
                <input
                type="radio"
                name="template"
                value={t.id}
                checked={selectedTemplate === t.id}
                onChange={() => setSelectedTemplate(t.id as "default" | "template1" | "template2" | "template3")}
                className="form-radio"/>
                <span>- {t.name}</span>
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
