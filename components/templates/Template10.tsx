"use client";

import React, { useEffect, useState } from "react";
import { Hero } from "@/types/hero";
import { About } from "@/types/about";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { ProjectsSection } from "@/components/projects-section";
import { FeatureDetailsModal } from "@/components/feature-details-modal";
import { ContactSection } from "@/components/contact-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TemplateProps {
  userId: string;
  categories: Category[];
  projects: Project[];
  userImage?: string;
  userName?: string;
}

export default function Template10({ userId, categories, projects, userImage, userName }: TemplateProps) {
  const [hero, setHero] = useState<Hero | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<About["features"][0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const endpoints = [
          { key: 'hero', url: `/api/hero?userId=${userId}` },
          { key: 'about', url: `/api/about?userId=${userId}` },
          { key: 'contact', url: `/api/contact/settings?userId=${userId}` },
        ];

        const results = await Promise.all(
          endpoints.map(async (end) => {
            const res = await fetch(end.url);
            if (!res.ok) {
              console.error(`Fetch failed for ${end.key} (${end.url}): ${res.status}`);
              return null;
            }
            try {
              return await res.json();
            } catch (e) {
              console.error(`JSON parse failed for ${end.key} (${end.url}):`, e);
              return null;
            }
          })
        );

        const [heroData, aboutData, contactData] = results;

        if (heroData && heroData._id) setHero(heroData);
        if (aboutData && aboutData._id) setAbout(aboutData);
        if (contactData && contactData._id) setContact(contactData);
      } catch (error) {
        console.error("Critical error fetching template data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return { truncated: false, text };
    const plainText = text.replace(/<[^>]*>/g, "");
    if (plainText.length <= limit) return { truncated: false, text };

    return {
      truncated: true,
      text: plainText.substring(0, limit) + "...",
    };
  };

  const handleFeatureClick = (feature: About["features"][0]) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-xs uppercase tracking-widest">
        Loading Protfolio...
      </div>
    );
  }

  return (
    <div className="template-10-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --black: #120d00;
          --white: #f5f5f0;
          --cyan: #ffd708;
          --cyan-dim: #d4b106;
          --gray-dark: #543e00;
          --gray-mid: #7f6402;
          --gray-light: #a98b04;
          --gray-text: #a9a082;
          --font-display: 'Bebas Neue', sans-serif;
          --font-body: 'DM Sans', sans-serif;
          --font-mono: 'Space Mono', monospace;
        }
        .template-10-wrapper {
          font-family: var(--font-body);
          background: var(--black);
          color: var(--white);
          overflow-x: hidden;
          min-height: 100vh;
        }
        .template-10-wrapper header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 40px;
          background: rgba(10,10,10,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,215,8,0.1);
        }
        .template-10-wrapper nav { display: flex; align-items: center; gap: 32px; }
        .template-10-wrapper nav a {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gray-text);
          text-decoration: none;
          transition: color 0.2s;
        }
        .template-10-wrapper nav a:hover { color: var(--cyan); }
        .template-10-wrapper .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--cyan);
          color: var(--black);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 10px 20px;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
        }
        .template-10-wrapper .btn-primary:hover { background: #fff; transform: translateY(-1px); }
        .template-10-wrapper .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          overflow: hidden;
        }
        .template-10-wrapper .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 60px 80px 60px;
          position: relative;
          z-index: 2;
        }
        .template-10-wrapper .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--cyan);
          margin-bottom: 24px;
        }
        .template-10-wrapper .hero-tag::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 1px;
          background: var(--cyan);
        }
        .template-10-wrapper .hero-title {
          font-family: var(--font-display);
          font-size: clamp(52px, 7vw, 90px);
          line-height: 0.92;
          letter-spacing: 0.02em;
          color: var(--white);
          margin-bottom: 28px;
        }
        .template-10-wrapper .hero-title span {
          -webkit-text-stroke: 1px var(--cyan);
          color: transparent;
        }
        .template-10-wrapper .hero-desc {
          font-size: 15px;
          line-height: 1.7;
          color: var(--gray-text);
          max-width: 420px;
          margin-bottom: 40px;
        }
        .template-10-wrapper .hero-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
        .template-10-wrapper .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255,215,8,0.3);
          color: var(--cyan);
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 10px 20px;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .template-10-wrapper .btn-ghost:hover { background: rgba(255,215,8,0.08); border-color: var(--cyan); }
        .template-10-wrapper .hero-right {
          position: relative;
          overflow: hidden;
        }
        .template-10-wrapper .hero-right img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          filter: grayscale(20%) contrast(1.05);
        }
        .template-10-wrapper .hero-right::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, var(--black) 0%, transparent 30%),
                      linear-gradient(to top, var(--black) 0%, transparent 25%);
        }
        .template-10-wrapper .hero-stats {
          position: absolute;
          bottom: 40px;
          left: 60px;
          right: 0;
          display: flex;
          gap: 40px;
          z-index: 3;
        }
        .template-10-wrapper .stat-number {
          font-family: var(--font-display);
          font-size: 36px;
          color: var(--cyan);
          line-height: 1;
        }
        .template-10-wrapper .stat-label {
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gray-text);
          margin-top: 4px;
        }
        .template-10-wrapper .banner-section {
          position: relative;
          height: 340px;
          overflow: hidden;
        }
        .template-10-wrapper .banner-section img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          filter: brightness(0.35) grayscale(40%);
        }
        .template-10-wrapper .banner-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 16px;
        }
        .template-10-wrapper .banner-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 6vw, 72px);
          letter-spacing: 0.06em;
          text-align: center;
          color: var(--white);
        }
        .template-10-wrapper .banner-title em {
          -webkit-text-stroke: 1px var(--cyan);
          color: transparent;
          font-style: normal;
        }
        .template-10-wrapper .banner-line {
          width: 60px;
          height: 2px;
          background: var(--cyan);
        }
        .template-10-wrapper .sobre {
          padding: 100px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          background: var(--gray-dark);
        }
        .template-10-wrapper .sobre-photo {
          position: relative;
        }
        .template-10-wrapper .sobre-photo img {
          width: 100%;
          max-width: 420px;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top;
          display: block;
        }
        .template-10-wrapper .sobre-photo::before {
          content: '';
          position: absolute;
          top: -12px; left: -12px;
          width: calc(100% - 40px);
          height: calc(100% - 40px);
          border: 1px solid rgba(255,215,8,0.25);
          pointer-events: none;
        }
        .template-10-wrapper .sobre-photo-badge {
          position: absolute;
          bottom: -20px;
          right: 20px;
          background: var(--cyan);
          color: var(--black);
          padding: 16px 24px;
          font-family: var(--font-display);
          font-size: 13px;
          letter-spacing: 0.06em;
          line-height: 1.3;
          text-transform: uppercase;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
          min-width: 180px;
        }
        .template-10-wrapper .section-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--cyan);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .template-10-wrapper .section-tag::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 1px;
          background: var(--cyan);
        }
        .template-10-wrapper .section-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 4vw, 54px);
          line-height: 1;
          letter-spacing: 0.02em;
          margin-bottom: 24px;
        }
        .template-10-wrapper .section-title span {
          -webkit-text-stroke: 1px var(--cyan);
          color: transparent;
        }
        .template-10-wrapper .sobre-desc {
          font-size: 15px;
          line-height: 1.75;
          color: var(--gray-text);
          margin-bottom: 32px;
        }
        .template-10-wrapper .sobre-features { display: flex; flex-direction: column; gap: 16px; margin-bottom: 36px; }
        .template-10-wrapper .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .template-10-wrapper .feature-icon {
          width: 32px;
          height: 32px;
          background: rgba(255,215,8,0.1);
          border: 1px solid rgba(255,215,8,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
        }
        .template-10-wrapper .feature-text strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 2px;
        }
        .template-10-wrapper .feature-text span {
          font-size: 13px;
          color: var(--gray-text);
          line-height: 1.5;
        }
        .template-10-wrapper .especialidades {
          padding: 100px 80px;
          background: var(--black);
        }
        .template-10-wrapper .section-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 64px;
        }
        .template-10-wrapper .section-header .section-title { margin-bottom: 16px; }
        .template-10-wrapper .section-header p { font-size: 15px; color: var(--gray-text); max-width: 480px; line-height: 1.7; }
        .template-10-wrapper .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        .template-10-wrapper .card {
          background: var(--gray-dark);
          padding: 36px 28px;
          border-top: 2px solid transparent;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
          cursor: default;
        }
        .template-10-wrapper .card:hover {
          border-color: var(--cyan);
          background: var(--gray-mid);
          transform: translateY(-4px);
        }
        .template-10-wrapper .card-num {
          font-family: var(--font-display);
          font-size: 52px;
          color: rgba(250, 234, 146, 0.15);
          line-height: 1;
          margin-bottom: 20px;
        }
        .template-10-wrapper .card-icon { font-size: 28px; margin-bottom: 16px; }
        .template-10-wrapper .card h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
          color: var(--white);
        }
        .template-10-wrapper .card p { font-size: 13px; color: var(--gray-text); line-height: 1.6; }
        .template-10-wrapper .processo {
          padding: 100px 80px;
          background: var(--gray-dark);
        }
        .template-10-wrapper .processo-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-top: 64px;
          position: relative;
        }
        .template-10-wrapper .processo-grid::before {
          content: '';
          position: absolute;
          top: 28px;
          left: 14%;
          right: 14%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,215,8,0.3), rgba(255,215,8,0.3), transparent);
        }
        .template-10-wrapper .processo-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 20px;
        }
        .template-10-wrapper .step-circle {
          width: 56px;
          height: 56px;
          border: 1px solid rgba(255,215,8,0.4);
          background: var(--gray-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 22px;
          color: var(--cyan);
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
          clip-path: polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%);
        }
        .template-10-wrapper .processo-step h3 {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .template-10-wrapper .processo-step p { font-size: 13px; color: var(--gray-text); line-height: 1.6; }
        .template-10-wrapper .curriculo {
          padding: 100px 80px;
          background: var(--black);
        }
        .template-10-wrapper .curriculo-inner {
          max-width: 900px;
          margin: 0 auto;
          background: var(--gray-dark);
          border: 1px solid var(--gray-light);
          padding: 60px;
          position: relative;
          overflow: hidden;
        }
        .template-10-wrapper .curriculo-inner::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(to right, var(--cyan), transparent);
        }
        .template-10-wrapper .curriculo-inner .section-tag { margin-bottom: 24px; }
        .template-10-wrapper .curriculo-list { display: flex; flex-direction: column; gap: 14px; margin-top: 32px; }
        .template-10-wrapper .curriculo-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 20px;
          background: rgba(255,215,8,0.04);
          border-left: 2px solid rgba(255,215,8,0.2);
          transition: border-color 0.2s, background 0.2s;
        }
        .template-10-wrapper .curriculo-item:hover { border-color: var(--cyan); background: rgba(255,215,8,0.08); }
        .template-10-wrapper .curriculo-item .check {
          color: var(--cyan);
          font-size: 14px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .template-10-wrapper .curriculo-item p { font-size: 14px; color: var(--gray-text); line-height: 1.6; }
        .template-10-wrapper .curriculo-item p strong { color: var(--white); }
        .template-10-wrapper .atendimento {
          padding: 100px 80px;
          background: var(--gray-dark);
        }
        .template-10-wrapper .atend-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          margin-top: 64px;
        }
        .template-10-wrapper .atend-card {
          background: var(--gray-mid);
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: background 0.2s;
          border-bottom: 2px solid transparent;
        }
        .template-10-wrapper .atend-card:hover { background: var(--gray-light); border-color: var(--cyan); }
        .template-10-wrapper .atend-card-icon { font-size: 32px; }
        .template-10-wrapper .atend-card h3 { font-size: 18px; font-weight: 600; }
        .template-10-wrapper .atend-card p { font-size: 14px; color: var(--gray-text); line-height: 1.65; }
        
        .template-10-wrapper #contact-form-wrapper { 
          padding: 8px 
        }
        .template-10-wrapper #contact-form-wrapper input{ 
          padding: 8px 
        }
        .template-10-wrapper #contact-form-wrapper textarea{ 
          padding: 8px 
        }
        
        .template-10-wrapper .cta-section {
          padding: 80px;
          background: linear-gradient(135deg, #120d00 0%, #543e00 50%, #120d00 100%);
          border-top: 1px solid rgba(0,229,255,0.15);
          border-bottom: 1px solid rgba(0,229,255,0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }
        .template-10-wrapper .cta-text h2 {
          font-family: var(--font-display);
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1.05;
          margin-bottom: 12px;
        }
        .template-10-wrapper .cta-text h2 span { color: var(--cyan); }
        .template-10-wrapper .cta-text p { font-size: 15px; color: var(--gray-text); max-width: 440px; line-height: 1.65; }
        .template-10-wrapper .contato {
          padding: 100px 80px;
          background: var(--black);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .template-10-wrapper .contato-info .section-tag { margin-bottom: 16px; }
        .template-10-wrapper .contato-info .section-title { margin-bottom: 24px; }
        .template-10-wrapper .contato-list { display: flex; flex-direction: column; gap: 20px; }
        .template-10-wrapper .contato-item {
          display: flex;
          align-items: center;
          gap: 16px;
          text-decoration: none;
          color: var(--white);
          transition: color 0.2s;
        }
        .template-10-wrapper .contato-item:hover { color: var(--cyan); }
        .template-10-wrapper .contato-item .ci-icon {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(255,215,8,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .template-10-wrapper .contato-item:hover .ci-icon { background: rgba(255,215,8,0.1); border-color: var(--cyan); }
        .template-10-wrapper .ci-text strong { display: block; font-size: 13px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--gray-text); margin-bottom: 2px; }
        .template-10-wrapper .ci-text span { font-size: 15px; font-weight: 500; }
        .template-10-wrapper .whatsapp-mockup {
          background: var(--gray-dark);
          border: 1px solid var(--gray-light);
          border-radius: 24px;
          overflow: hidden;
          max-width: 340px;
          margin-left: auto;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }
        .template-10-wrapper .wa-header {
          background: var(--gray-mid);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--gray-light);
        }
        .template-10-wrapper .wa-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gray-light);
          overflow: hidden;
        }
        .template-10-wrapper .wa-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
        .template-10-wrapper .wa-name { font-size: 14px; font-weight: 600; }
        .template-10-wrapper .wa-status { font-size: 11px; color: #25D366; }
        .template-10-wrapper .wa-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; background: #0a1a12; }
        .template-10-wrapper .wa-msg {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 0 12px 12px 12px;
          font-size: 13px;
          line-height: 1.5;
          background: var(--gray-mid);
          color: var(--white);
          position: relative;
        }
        .template-10-wrapper .wa-msg.sent {
          align-self: flex-end;
          background: #1a3a2a;
          border-radius: 12px 0 12px 12px;
          color: #e0ffe0;
        }
        .template-10-wrapper .wa-time { font-size: 10px; color: var(--gray-text); margin-top: 4px; display: block; text-align: right; }
        .template-10-wrapper footer {
          background: var(--gray-dark);
          border-top: 1px solid var(--gray-light);
          padding: 32px 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .template-10-wrapper .footer-logo img { height: 28px; display: block; opacity: 0.7; }
        .template-10-wrapper .footer-copy {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--gray-text);
          letter-spacing: 0.06em;
        }
        .template-10-wrapper .footer-links { display: flex; gap: 24px; }
        .template-10-wrapper .footer-links a {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--gray-text);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: color 0.2s;
        }
        .template-10-wrapper .footer-links a:hover { color: var(--cyan); }

        /* ProjectsSection Overrides for Template 2 */
        .template-10-wrapper #projects {
          background: var(--black) !important;
          color: var(--white) !important;
          padding: 100px 0 !important;
        }
        .template-10-wrapper #projects h2 {
          font-family: var(--font-display) !important;
          color: var(--white) !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .template-10-wrapper #projects p {
          color: var(--gray-text) !important;
          font-family: var(--font-body) !important;
        }
        .template-10-wrapper #projects [role="tablist"] {
          background: var(--gray-dark) !important;
          border: 1px solid rgba(255,215,8,0.2) !important;
          color: var(--white) !important;
        }
        .template-10-wrapper #projects [role="tab"][data-state="active"] {
          background: var(--cyan) !important;
          color: var(--black) !important;
        }
        .template-10-wrapper #projects [role="tab"] {
          color: var(--gray-text) !important;
        }
        .template-10-wrapper #projects .group {
          background: var(--gray-dark) !important;
          border: 1px solid var(--gray-light) !important;
          border-radius: 20px !important;
        }
        .template-10-wrapper #projects .group:hover {
          border-color: var(--cyan) !important;
          box-shadow: 0 0 30px rgba(0,229,255,0.15) !important;
        }
        .template-10-wrapper #projects .group h3 {
          color: var(--white) !important;
          font-family: var(--font-display) !important;
          text-transform: uppercase !important;
        }
        .template-10-wrapper #projects .group h3:hover {
          color: var(--cyan) !important;
        }
        .template-10-wrapper #projects .group span {
          background: rgba(255,215,8,0.1) !important;
          color: var(--cyan) !important;
          border: 1px solid rgba(255,215,8,0.3) !important;
          font-family: var(--font-mono) !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
        }
        .template-10-wrapper #projects button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .template-10-wrapper #projects .rounded-full.w-10.h-10 {
          background: var(--gray-dark) !important;
          border: 1px solid rgba(255,215,8,0.3) !important;
          color: var(--cyan) !important;
        }
        .template-10-wrapper #card-projects-wrapper {
          padding: 0 !important;
        }

        @media (max-width: 900px) {
          .template-10-wrapper header { padding: 14px 20px; }
          .template-10-wrapper nav { display: none; }
          .template-10-wrapper .hero { grid-template-columns: 1fr; min-height: auto; }
          .template-10-wrapper .hero-left { padding: 100px 30px 60px; }
          .template-10-wrapper .hero-right { height: 60vw; }
          .template-10-wrapper .hero-stats { left: 30px; bottom: 20px; gap: 24px; }
          .template-10-wrapper .sobre, .template-10-wrapper .contato { grid-template-columns: 1fr; padding: 60px 30px; gap: 48px; }
          .template-10-wrapper .sobre-photo img { max-width: 100%; aspect-ratio: 4/5; }
          .template-10-wrapper .cards-grid, .template-10-wrapper .processo-grid, .template-10-wrapper .atend-grid { grid-template-columns: 1fr 1fr; }
          .template-10-wrapper .especialidades, .template-10-wrapper .processo, .template-10-wrapper .curriculo, .template-10-wrapper .atendimento { padding: 60px 30px; }
          .template-10-wrapper .cta-section { padding: 60px 30px; flex-direction: column; text-align: center; }
          .template-10-wrapper .curriculo-inner { padding: 36px 24px; }
          .template-10-wrapper footer { padding: 24px 30px; flex-direction: column; align-items: center; text-align: center; gap: 12px; }
          .template-10-wrapper .whatsapp-mockup { max-width: 100%; margin: 0; }
        }
        @media (max-width: 560px) {
          .template-10-wrapper .cards-grid, .template-10-wrapper .processo-grid, .template-10-wrapper .atend-grid { grid-template-columns: 1fr; }
          .template-10-wrapper .hero-title { font-size: 44px; }
          .template-10-wrapper .banner-section { height: 200px; }
        }
      `}}
      />

      <header>
        <div className="header-logo">
          {/* Logo can be added here if provided in hero data */}
        </div>
        <nav>
          <a href="#sobre">Sobre</a>
          <a href="#especialidades">Serviços</a>
          <a href="#curriculo">Currículo</a>
          <a href="#contato">Contato</a>
        </nav>
        <a href="#contato" className="btn-primary">▶ Entrar em Contato</a>
      </header>

      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">Portify — Perfil Profissional</div>
          <h1 className="hero-title">
            {hero?.title?.split(" ")[0]}<br />
            <span>{hero?.title?.split(" ").slice(1).join(" ")}</span><br />
            Profissional
          </h1>
          <p className="hero-desc">
            {hero?.subtitle || "Bem-vindo ao meu espaço profissional. Aqui você encontra minha trajetória, especialidades e formas de entrar em contato para uma parceria de sucesso."}
          </p>
          <div className="hero-actions my-6">
            <a href="#contato" className="btn-primary">▶ Fale Comigo</a>
            <a href="#especialidades" className="btn-ghost">→ Ver Serviços</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Anos de Exp.</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Clientes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Dedicação</div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <img src={hero?.backgroundImage || "https://images.unsplash.com/photo-1497366216548-375260702979?auto=format&fit=crop&w=1000&q=80"} alt="Hero" />
        </div>
      </section>

      <section className="banner-section">
        <div className="banner-overlay">
          <div className="banner-line"></div>
          <h2 className="banner-title">CUIDADO <em>PENSADO</em><br />PARA VOCÊ</h2>
          <div className="banner-line"></div>
        </div>
      </section>

      <section className="sobre" id="sobre">
        <div className="sobre-photo">
          <div className="sobre-photo-badge">{hero?.title || (userName || "Pablo Azevedo")}<br />Profissional</div>
          <Image
            src={userImage || hero?.backgroundImage || "https://images.unsplash.com/photo-1497366216548-375260702979?auto=format&fit=crop&w=1000&q=80"}
            alt={userName || "About"}
            className="w-full h-auto max-w-[420px] aspect-auto object-cover"
            width={600}
            height={800}
          />
        </div>
        <div className="sobre-content">
          <div className="section-tag">Sobre Mim</div>
          <h2 className="section-title">Atendimento <span>focado</span><br />nos seus resultados</h2>
          <div
            className="sobre-desc"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about?.description || "Sou Pablo Azevedo, profissional com anos de experiência no mercado. Meu trabalho é entregar resultados reais, com comprometimento, estratégia e uma abordagem personalizada para cada cliente.") }}
          />
          <div className="sobre-features">
            {about?.features?.map((feature, i) => {
              const { truncated, text: truncatedText } = truncateText(feature.description, 250);
              return (
                <div
                  className="feature-item"
                  key={i}
                  onClick={() => truncated && handleFeatureClick(feature)}
                  style={{ cursor: truncated ? "pointer" : "default" }}
                >
                  <div className="feature-icon">✦</div>
                  <div className="feature-text">
                    <strong>{feature.title}</strong>
                    <span dangerouslySetInnerHTML={{ __html: truncated ? truncatedText : DOMPurify.sanitize(feature.description) }}></span>
                  </div>
                </div>
              );
            }) || [
              { title: "Plano personalizado", description: "Soluções únicas para cada objetivo e necessidade específica." },
              { title: "Acompanhamento contínuo", description: "Suporte constante para garantir evolução e resultados consistentes." },
              { title: "Orientações claras", description: "Comunicação transparente e objetiva em cada etapa do processo." }
            ].map((f, i) => (
              <div className="feature-item" key={i}>
                <div className="feature-icon">✦</div>
                <div className="feature-text">
                  <strong>{f.title}</strong>
                  <span>{f.description}</span>
                </div>
              </div>
            ))
          }
          </div>
          <a href="#contato" className="btn-primary">▶ Falar Comigo</a>
        </div>
      </section>

      <section className="especialidades" id="especialidades">
        <div className="section-header">
          <div className="section-tag">Especialidades</div>
          <h2 className="section-title">Como posso <span>te ajudar</span></h2>
          <p>Áreas de atuação com foco em qualidade, resultado e excelência profissional.</p>
        </div>
        <div className="cards-grid">
          {categories.length > 0 ? (
            categories.map((cat, i) => (
              <div className="card" key={cat._id || i}>
                <div className="card-num"><em>{String(i + 1).padStart(2, "0")}</em></div>
                <div className="card-icon">◉</div>
                <h3>{cat.name}</h3>
                <p>{cat.description || "Especialista nesta categoria com foco em alta performance e resultados."}</p>
              </div>
            ))
          ) : (
            [
              { name: "Consultoria Estratégica", description: "Análise completa da sua situação para criar planos efetivos e alcançar seus objetivos." },
              { name: "Planejamento", description: "Desenvolvimento de estratégias personalizadas para maximizar seus resultados." },
              { name: "Acompanhamento", description: "Suporte contínuo com monitoramento e ajustes ao longo de toda a jornada." },
              { name: "Performance", description: "Estratégias avançadas para potencializar sua performance e alcançar o topo." }
            ].map((c, i) => (
              <div className="card" key={i}>
                <div className="card-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="card-icon">◉</div>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <ProjectsSection
        title="Projetos"
        userId={userId}
        initialCategories={categories}
        initialProjects={projects}
      />

      <section className="processo" id="processo">
        <div className="section-header">
          <div className="section-tag">Como Funciona</div>
          <h2 className="section-title">Um processo <span>claro</span> e eficiente</h2>
          <p>Simples, direto e humanizado — do primeiro contato ao resultado final.</p>
        </div>
        <div className="processo-grid">
          {[
            { step: "01", title: "Consulta Inicial", desc: "Conversamos para entender suas necessidades e objetivos específicos." },
            { step: "02", title: "Estratégia", desc: "Desenvolvimento de um plano personalizado para o seu perfil." },
            { step: "03", title: "Execução", desc: "Aplicação das estratégias com acompanhamento e orientação prática." },
            { step: "04", title: "Resultados", desc: "Monitoramento contínuo e ajustes para garantir os melhores resultados." },
          ].map((s, i) => (
            <div className="processo-step" key={i}>
              <div className="step-circle">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="curriculo" id="curriculo">
        <div className="curriculo-inner">
          <div className="section-tag">Meu Currículo</div>
          <h2 className="section-title">Trajetória e <span>Formação</span></h2>
          <div className="curriculo-list">
            {[
              { title: "Formação superior", desc: "Graduação na área de atuação com distinção acadêmica." },
              { title: "Especialização", desc: "Pós-graduação e cursos avançados na área de especialidade." },
              { title: "Aperfeiçoamento contínuo", desc: "Certificações e atualizações regulares no mercado." },
              { title: "+500 clientes atendidos", desc: "Ampla experiência com resultados comprovados." },
            ].map((item, i) => (
              <div className="curriculo-item" key={i}>
                <span className="check">✓</span>
                <p><strong>{item.title}</strong> — {item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="atendimento" id="atendimento">
        <div className="section-header">
          <div className="section-tag">Meu Atendimento</div>
          <h2 className="section-title">Como funciona <span>meu</span> serviço</h2>
          <p>Atendimento humanizado, prático e focado no seu bem-estar e evolução.</p>
        </div>
        <div className="atend-grid">
          {[
            { icon: "◉", title: "Sessão de 1 hora", desc: "Atendimento completo e detalhado para entender sua situação e desenvolver o plano ideal para você." },
            { icon: "◈", title: "Retorno em 30 dias", desc: "Acompanhamento do plano e ajustes conforme sua evolução para garantir os melhores resultados." },
            { icon: "◇", title: "Estratégia Online", desc: "Diagnóstico completo, mapeamento de pontos de melhoria e evolução do plano estratégico." },
            { icon: "✦", title: "Suporte Contínuo", desc: "Sempre disponível para dúvidas e orientações, porque seu progresso é minha prioridade." },
          ].map((card, i) => (
            <div className="atend-card" key={i}>
              <div className="atend-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-text">
          <h2>Dê o primeiro passo<br />para o seu <span>sucesso</span></h2>
          <p>Transforme seus objetivos em realidade com um acompanhamento profissional que realmente faz a diferença.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
          onClick={() => setIsContactModalOpen(true)}
          className="btn-primary"
          style={{ fontSize: "13px", padding: "14px 28px", cursor: 'pointer' }}
        >
          ▶ Agendar Agora
        </button>
        {contact?.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: "13px", padding: "14px 28px", background: "#25D366", color: "white" }}
            >
              📱 WhatsApp
            </a>
          )}
        </div>
        
      </section>

      <section className="contato" id="contato">
        <div className="contato-info">
          <div className="section-tag">Contato</div>
          <h2 className="section-title">Fale com<br /><span>{hero?.title?.split(" ")[0] || "Pablo"}</span></h2>
          <div className="contato-list">
            <a href={contact?.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : "#"} className="contato-item" target="_blank" rel="noopener noreferrer">
              <div className="ci-icon">📱</div>
              <div className="ci-text">
                <strong>WhatsApp</strong>
                <span>{contact?.whatsapp || "(00) 00000-0000"}</span>
              </div>
            </a>
            <a href={contact?.email ? `mailto:${contact.email}` : "#"} className="contato-item">
              <div className="ci-icon">✉</div>
              <div className="ci-text">
                <strong>E-mail</strong>
                <span>{contact?.email || "pablo@email.com"}</span>
              </div>
            </a>
            <div className="contato-item" style={{ cursor: "default" }}>
              <div className="ci-icon">📍</div>
              <div className="ci-text">
                <strong>Localização</strong>
                <span>
                  {contact?.address && (contact.address.street || contact.address.city || contact.address.state)
                    ? [contact.address.street, contact.address.city, contact.address.state].filter(Boolean).join(", ")
                    : "Atendimento Online e Presencial"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="whatsapp-mockup">
          <div className="wa-header">
            <div className="wa-avatar">
              <Image
                src={userImage || hero?.backgroundImage || "https://images.unsplash.com/photo-1497366216548-375260702979?auto=format&fit=crop&w=1000&q=80"}
                alt="Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover object-position-top"
              />
            </div>
            <div>
              <div className="wa-name">{userName || hero?.title || "Pablo Azevedo"}</div>
              <div className="wa-status">● Online agora</div>
            </div>
          </div>
          <div className="wa-body">
            <div className="wa-msg">
              Olá! Vim pelo seu perfil no Portify 👋<br />Gostaria de saber mais sobre seus serviços!
              <span className="wa-time">09:41</span>
            </div>
            <div className="wa-msg sent">
              Olá! Seja bem-vindo(a)! Fico feliz pelo interesse. Como posso te ajudar hoje? 😊
              <span className="wa-time">09:42</span>
            </div>
            <div className="wa-msg">
              Quero agendar uma consulta inicial para entender melhor o processo.
              <span className="wa-time">09:43</span>
            </div>
            <div className="wa-msg sent">
              Perfeito! Vou te enviar os horários disponíveis agora mesmo ✅
              <span className="wa-time">09:43</span>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-logo">
          {/* Logo can be added here */}
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} {hero?.title || "Pablo Azevedo"} — Todos os direitos reservados.</p>
        <div className="footer-links">
          <a href="#sobre">Sobre</a>
          <a href="#especialidades">Serviços</a>
          <a href="#contato">Contato</a>
        </div>
      </footer>
      <FeatureDetailsModal
        feature={selectedFeature}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Entre em Contato</DialogTitle>
          </DialogHeader>
          <ContactSection userId={userId} compact />
        </DialogContent>
      </Dialog>
    </div>
  );
}
