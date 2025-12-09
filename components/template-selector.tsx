"use client";

import React, { useState } from "react";
import { useTemplate } from "./template-context";

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
      <label className="block mb-2 font-semibold">Selecione o Template do Portfólio:</label>
      <div className="flex flex-col space-y-2 mb-4">
        {templates.map((t) => (
          <label key={t.id} className="inline-flex items-center space-x-2">
            <input
              type="radio"
              name="template"
              value={t.id}
              checked={selectedTemplate === t.id}
              onChange={() => setSelectedTemplate(t.id as "default" | "template1" | "template2" | "template3")}
              className="form-radio"
            />
            <span>{t.name}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Salvar
      </button>
    </div>
  );
}
