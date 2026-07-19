"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type TemplateType = "default" | "template1" | "template2" | "template3" | "template4" | "template5" | "template6" | "template7" | "template8" | "template9" | "template10" | "template11"  | "template12" | "template13" | "template14" | "template15" | "template16" | "template17";

interface TemplateContextProps {
  template: TemplateType;
  setTemplate: (template: TemplateType) => Promise<boolean>;
}

const TemplateContext = createContext<TemplateContextProps | undefined>(undefined);

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [template, setTemplateState] = useState<TemplateType>("default");

  // Load saved template from backend API on mount
  useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch("/api/user/template");
        if (res.ok) {
          const data = await res.json();
          console.log("Template recebido da API:", data.template);
          if (data.template) {
            setTemplateState(data.template);
          }
        }
      } catch (error) {
        console.error("Failed to fetch template:", error);
      }
    }
    fetchTemplate();
  }, []);

  // Update template state and persist to backend API
  const setTemplate = async (newTemplate: TemplateType): Promise<boolean> => {
    setTemplateState(newTemplate);
    try {
      const res = await fetch("/api/user/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: newTemplate }),
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to update template:", error);
      return false;
    }
  };

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
