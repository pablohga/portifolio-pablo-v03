"use client";

import React from "react";
import { useTemplate } from "./template-context";

const templates = [
  { id: "default", name: "Default" },
  { id: "template1", name: "Template 1" },
  { id: "template2", name: "Template 2" },
  { id: "template3", name: "Template 3" },
];

export function TemplateSelector() {
  const { template, setTemplate } = useTemplate();

  return (
    <div className="mb-6">
      <label htmlFor="template-select" className="block mb-2 font-semibold">
        Selecione o Template do Portfólio:
      </label>
      <select
        id="template-select"
        value={template}
      onChange={(e) => setTemplate(e.target.value as any)}
        className="border border-gray-300 rounded px-3 py-2"
      >
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
