import React from "react";
import { About } from "@/types/about";
import { DARK, LIGHT } from "@/constants/theme";

interface MetricProps {
  about: About | undefined;
  dark?: boolean;
  style?: string | React.CSSProperties;
}

const c = (dark?: boolean) => (dark ? DARK : LIGHT);

export function ProjectsDelivered({ about, dark }: MetricProps) {
  if (!about?.projectsDelivered) return null;
  const theme = c(dark);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "22px", fontWeight: 700, color: dark ? "#FFFFFF" : "#1E2A3A" }}>
        {about.projectsDelivered}
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: theme.textMuted }}>
        Projetos Entregues
      </div>
    </div>
  );
}

export function SatisfiedClients({ about, dark }: MetricProps) {
  if (!about?.satisfiedClients) return null;
  const theme = c(dark);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "22px", fontWeight: 700, color: dark ? "#FFFFFF" : "#1E2A3A" }}>
        {about.satisfiedClients}
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: theme.textMuted }}>
        Clientes Satisfeitos
      </div>
    </div>
  );
}

export function ExperienceTime({ about, dark }: MetricProps) {
  if (!about?.experienceTime) return null;
  const theme = c(dark);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "22px", fontWeight: 700, color: dark ? "#FFFFFF" : "#1E2A3A" }}>
        {about.experienceTime}
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: theme.textMuted }}>
        Tempo de Experiência
      </div>
    </div>
  );
}
