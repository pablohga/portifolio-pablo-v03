"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type TemplateType = "default" | "template1" | "template2" | "template3";

interface TemplateContextProps {
  template: TemplateType;
  setTemplate: (template: TemplateType) => void;
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
  const setTemplate = async (newTemplate: TemplateType) => {
    setTemplateState(newTemplate);
    try {
      const res = await fetch("/api/user/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: newTemplate }),
      });
      if (!res.ok) {
        console.error("Failed to update template");
      }
    } catch (error) {
      console.error("Failed to update template:", error);
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
