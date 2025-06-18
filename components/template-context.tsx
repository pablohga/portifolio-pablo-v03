"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type TemplateType = "default" | "template1" | "template2" | "template3";

interface TemplateContextProps {
  template: TemplateType;
  setTemplate: (template: TemplateType) => void;
}

const TemplateContext = createContext<TemplateContextProps | undefined>(undefined);

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [template, setTemplate] = useState<TemplateType>("default");

  // Load saved template from localStorage or API on mount
  useEffect(() => {
    const savedTemplate = localStorage.getItem("selectedTemplate") as TemplateType | null;
    if (savedTemplate) {
      setTemplate(savedTemplate);
    }
  }, []);

  // Save template selection to localStorage or API
  useEffect(() => {
    localStorage.setItem("selectedTemplate", template);
  }, [template]);

  return (
    <TemplateContext.Provider value={{ template, setTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = (): TemplateContextProps => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
};
