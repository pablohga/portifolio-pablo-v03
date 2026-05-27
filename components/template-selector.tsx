"use client";

import React, { useState } from "react";
import { useTemplate } from "./template-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const templates = [
  { id: "default", name: "Default" },
  { id: "template1", name: "Template 1" },
  { id: "template2", name: "Template 2" },
  { id: "template3", name: "Template 3" },
];

export function TemplateSelector() {
  const { template, setTemplate } = useTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<"default" | "template1" | "template2" | "template3">(template);

  const handleSave = () => {
    setTemplate(selectedTemplate);
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-semibold">
        Selecione o Template do seu Portfólio:
      </label>
      <div className="flex flex-row gap-4 mb-4">
        {templates.map((t) => (
          <label key={t.id} className="inline-flex items-center space-x-2">
            
            <div class="flex flex-col gap-4 mb-4">
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
      <Button onClick={handleSave}>
        Gravar
      </Button>
    </div>
  );
}
