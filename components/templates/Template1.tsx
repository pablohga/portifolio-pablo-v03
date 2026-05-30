"use client";

import React, { useEffect, useState } from "react";
import { Hero } from "@/types/hero";
import { About } from "@/types/about";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import DOMPurify from "isomorphic-dompurify";

interface TemplateProps {
  userId: string;
  categories: Category[];
  projects: Project[];
}

export default function Template1({ userId, categories, projects }: TemplateProps) {
  const [hero, setHero] = useState<Hero | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [heroRes, aboutRes] = await Promise.all([
          fetch(`/api/hero?userId=${userId}`),
          fetch(`/api/about?userId=${userId}`),
        ]);
        const heroData = await heroRes.json();
        const aboutData = await aboutRes.json();

        if (heroData._id) setHero(heroData);
        if (aboutData && aboutData._id) setAbout(aboutData);
      } catch (error) {
        console.error("Failed to fetch template data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-xs uppercase tracking-widest">
        Loading Template...
      </div>
    );
  }

  return (
    <div className="template-1-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&display=swap');
        :root {
          --bg:        #050c0f;
          --bg2:       #081318;
          --bg3:       #0c1c24;
          --card:      #0f2028;
          --card2:     #122530;
          --teal:      #00d4c0;
          --teal2:     #00b8a6;
          --teal-dim:  rgba(0,212,192,.12);
          --teal-glow: rgba(0,212,192,.25);
          --green:     #1de080;
          --amber:     #f5c842;
          --text:      #e8f0f0;
          --muted:     #7a9fa8;
          --border:    rgba(0,212,192,.18);
          --r:         12px;
          --r2:        20px;
        }
        .template-1-wrapper {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.65;
          overflow-x: hidden;
        }
        .template-1-wrapper *, .template-1-wrapper *::before, .template-1-wrapper *::after { box-sizing: border-box; margin: 0; padding: 0 }
        .template-1-wrapper html { scroll-behavior: smooth }
        .template-1-wrapper .container { max-width: 1100px; margin: 0 auto; padding: 0 24px }
        .template-1-wrapper .teal { color: var(--teal) }
        .template-1-wrapper .green { color: var(--green) }
        .template-1-wrapper .amber { color: var(--amber) }
        .template-1-wrapper .muted { color: var(--muted) }
        .template-1-wrapper .badge {
          display: inline-block;
          background: var(--teal-dim);
          border: 1px solid var(--border);
          color: var(--teal);
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 999px;
          margin-bottom: 18px;
        }
        .template-1-wrapper .tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--teal-dim);
          border: 1px solid var(--border);
          color: var(--teal);
          font-size: .78rem; font-weight: 600;
          padding: 4px 12px; border-radius: 6px;
        }
        .template-1-wrapper .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--teal);
          color: #050c0f;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .95rem;
          letter-spacing: .03em;
          padding: 14px 32px;
          border-radius: var(--r);
          border: none; cursor: pointer;
          text-decoration: none;
          transition: all .22s ease;
          box-shadow: 0 0 24px rgba(0,212,192,.35);
        }
        .template-1-wrapper .btn-primary:hover {
          background: var(--teal2);
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(0,212,192,.5);
        }
        .template-1-wrapper .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          color: var(--teal);
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .9rem;
          padding: 12px 28px;
          border-radius: var(--r);
          border: 1.5px solid var(--border);
          cursor: pointer; text-decoration: none;
          transition: all .22s ease;
        }
        .template-1-wrapper .btn-ghost:hover {
          background: var(--teal-dim);
          border-color: var(--teal);
        }
        .template-1-wrapper .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.7rem, 3.5vw, 2.6rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -.02em;
        }
        .template-1-wrapper .section-sub {
          font-size: 1rem;
          color: var(--muted);
          max-width: 600px;
          margin-top: 12px;
        }
        .template-1-wrapper nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(5, 12, 15, .92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 14px 0;
        }
        .template-1-wrapper nav .container {
          display: flex; align-items: center; justify-content: space-between;
        }
        .template-1-wrapper nav img { height: 32px; object-fit: contain }
        .template-1-wrapper .nav-cta { font-size: .85rem; padding: 10px 22px }
        .template-1-wrapper #hero {
          position: relative;
          padding: 80px 0 0;
          background: var(--bg);
          overflow: hidden;
        }
        .template-1-wrapper #hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 70% 40%, rgba(0,212,192,.09) 0%, transparent 70%);
          pointer-events: none;
        }
        .template-1-wrapper .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: flex-end;
        }
        .template-1-wrapper .hero-copy { padding-bottom: 80px }
        .template-1-wrapper .hero-copy h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 4vw, 3.1rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -.03em;
          margin-bottom: 22px;
        }
        .template-1-wrapper .hero-copy p {
          font-size: 1.05rem; color: var(--muted);
          margin-bottom: 32px; max-width: 460px;
        }
        .template-1-wrapper .hero-stats {
          display: flex; gap: 32px; margin-top: 40px;
        }
        .template-1-wrapper .hero-stat span {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem; font-weight: 700;
          color: var(--teal);
        }
        .template-1-wrapper .hero-stat small { font-size: .78rem; color: var(--muted) }
        .template-1-wrapper .hero-img-wrap {
          position: relative; align-self: flex-end;
          display: flex; justify-content: center;
        }
        .template-1-wrapper .hero-img-wrap::before {
          content: ''; position: absolute;
          bottom: 0; left: 50%; transform: translateX(-50%);
          width: 340px; height: 340px;
          background: radial-gradient(circle, var(--teal-glow) 0%, transparent 70%);
          border-radius: 50%;
        }
        .template-1-wrapper .hero-img-wrap img {
          position: relative; z-index: 1;
          max-height: 520px; object-fit: contain;
          filter: drop-shadow(0 0 40px rgba(0,212,192,.2));
        }
        .template-1-wrapper .hero-banner {
          width: 100%;
          background: linear-gradient(135deg,#0c1c24 0%,#081318 100%);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 18px 0; margin-top: 0;
        }
        .template-1-wrapper .hero-banner .container {
          display: flex; align-items: center; justify-content: center;
          gap: 40px; flex-wrap: wrap;
        }
        .template-1-wrapper .hb-item {
          display: flex; align-items: center; gap: 10px;
          font-size: .85rem; color: var(--muted);
          white-space: nowrap;
        }
        .template-1-wrapper .hb-item .dot {
          width: 8px; height: 8px;
          border-radius: 50%; background: var(--teal);
          flex-shrink: 0;
        }
        .template-1-wrapper #pain {
          padding: 90px 0;
          background: var(--bg2);
        }
        .template-1-wrapper #pain .container { text-align: center }
        .template-1-wrapper .pain-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px; margin-top: 48px;
        }
        .template-1-wrapper .pain-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 28px 24px;
          text-align: left;
          transition: border-color .2s;
        }
        .template-1-wrapper .pain-card:hover { border-color: var(--teal) }
        .template-1-wrapper .pain-icon {
          width: 40px; height: 40px;
          background: var(--teal-dim);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; margin-bottom: 14px;
        }
        .template-1-wrapper .pain-card h4 {
          font-family: 'Syne', sans-serif;
          font-size: .95rem; font-weight: 700;
          margin-bottom: 8px;
        }
        .template-1-wrapper .pain-card p { font-size: .83rem; color: var(--muted) }
        .template-1-wrapper #modules {
          padding: 90px 0;
          background: var(--bg);
        }
        .template-1-wrapper .modules-header { margin-bottom: 52px }
        .template-1-wrapper .modules-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .template-1-wrapper .module-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 26px 22px;
          position: relative; overflow: hidden;
          transition: all .25s;
        }
        .template-1-wrapper .module-card::after {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--teal), transparent);
          opacity: 0; transition: opacity .25s;
        }
        .template-1-wrapper .module-card:hover { border-color: var(--teal); transform: translateY(-3px) }
        .template-1-wrapper .module-card:hover::after { opacity: 1 }
        .template-1-wrapper .mod-num {
          font-family: 'Syne', sans-serif;
          font-size: .7rem; font-weight: 700;
          letter-spacing: .15em; color: var(--teal);
          text-transform: uppercase; margin-bottom: 10px;
        }
        .template-1-wrapper .module-card h4 {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700;
          margin-bottom: 8px;
        }
        .template-1-wrapper .module-card p { font-size: .82rem; color: var(--muted) }
        .template-1-wrapper #forwho {
          padding: 90px 0;
          background: var(--bg2);
        }
        .template-1-wrapper .forwho-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 32px; margin-top: 48px;
        }
        .template-1-wrapper .fw-col {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 32px 28px;
        }
        .template-1-wrapper .fw-col h3 {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700;
          margin-bottom: 20px;
        }
        .template-1-wrapper .fw-list { list-style: none }
        .template-1-wrapper .fw-list li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: .88rem; color: var(--muted);
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        .template-1-wrapper .fw-list li:last-child { border-bottom: none }
        .template-1-wrapper .fw-list .ico { color: var(--teal); font-size: 1rem; flex-shrink: 0; margin-top: 1px }
        .template-1-wrapper .fw-list .ico.no { color: #e05555 }
        .template-1-wrapper #method {
          padding: 90px 0;
          background: var(--bg);
        }
        .template-1-wrapper .method-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: center;
          margin-top: 0;
        }
        .template-1-wrapper .method-steps {
          counter-reset: step;
          display: flex; flex-direction: column; gap: 24px;
          margin-top: 40px;
        }
        .template-1-wrapper .step {
          display: flex; gap: 20px; align-items: flex-start;
          counter-increment: step;
        }
        .template-1-wrapper .step-num {
          width: 44px; height: 44px; flex-shrink: 0;
          background: var(--teal-dim);
          border: 1px solid var(--border);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700; color: var(--teal);
        }
        .template-1-wrapper .step-body h4 {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700; margin-bottom: 5px;
        }
        .template-1-wrapper .step-body p { font-size: .84rem; color: var(--muted) }
        .template-1-wrapper .method-visual {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 36px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .template-1-wrapper .mv-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px;
          background: var(--bg3);
          border-radius: var(--r);
          font-size: .88rem;
        }
        .template-1-wrapper .mv-row span { font-weight: 600 }
        .template-1-wrapper .mv-row small { display: block; color: var(--muted); font-size: .78rem }
        .template-1-wrapper #testimonials {
          padding: 90px 0;
          background: var(--bg2);
        }
        .template-1-wrapper .testi-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 20px; margin-top: 48px;
        }
        .template-1-wrapper .testi-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 28px 24px;
          transition: border-color .2s;
        }
        .template-1-wrapper .testi-card:hover { border-color: var(--teal) }
        .template-1-wrapper .stars { color: var(--amber); font-size: .85rem; margin-bottom: 12px }
        .template-1-wrapper .testi-text {
          font-size: .88rem; color: var(--muted);
          margin-bottom: 18px; line-height: 1.7;
        }
        .template-1-wrapper .testi-author {
          display: flex; align-items: center; gap: 10px;
        }
        .template-1-wrapper .testi-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--teal-dim);
          border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: .85rem; font-weight: 700; color: var(--teal);
          flex-shrink: 0;
        }
        .template-1-wrapper .testi-name { font-size: .85rem; font-weight: 700 }
        .template-1-wrapper .testi-role { font-size: .75rem; color: var(--muted) }
        .template-1-wrapper #instructor {
          padding: 90px 0;
          background: var(--bg);
          overflow: hidden;
        }
        .template-1-wrapper .instructor-grid {
          display: grid; grid-template-columns: 1fr 1.2fr;
          gap: 60px; align-items: center;
        }
        .template-1-wrapper .instructor-img {
          position: relative;
        }
        .template-1-wrapper .instructor-img::before {
          content: ''; position: absolute;
          inset: -20px; z-index: 0;
          background: radial-gradient(circle at 50% 60%, var(--teal-glow) 0%, transparent 65%);
          border-radius: 50%;
        }
        .template-1-wrapper .instructor-img img {
          position: relative; z-index: 1;
          width: 100%; border-radius: var(--r2);
          object-fit: cover;
          border: 1px solid var(--border);
          filter: drop-shadow(0 20px 60px rgba(0,0,0,.5));
        }
        .template-1-wrapper .instructor-copy .badge { margin-bottom: 14px }
        .template-1-wrapper .instructor-copy h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 700; margin-bottom: 8px;
        }
        .template-1-wrapper .instructor-copy .sub-name {
          color: var(--teal); font-size: 1rem;
          font-weight: 600; margin-bottom: 20px;
        }
        .template-1-wrapper .instructor-copy p {
          font-size: .92rem; color: var(--muted);
          margin-bottom: 14px; line-height: 1.75;
        }
        .template-1-wrapper .instructor-stats {
          display: flex; gap: 24px; margin-top: 28px; flex-wrap: wrap;
        }
        .template-1-wrapper .i-stat {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r);
          padding: 14px 20px;
          text-align: center;
        }
        .template-1-wrapper .i-stat span {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem; font-weight: 700; color: var(--teal);
        }
        .template-1-wrapper .i-stat small { font-size: .75rem; color: var(--muted) }
        .template-1-wrapper #pricing {
          padding: 90px 0;
          background: var(--bg2);
        }
        .template-1-wrapper .pricing-wrap {
          max-width: 700px; margin: 48px auto 0;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 48px;
          position: relative; overflow: hidden;
          text-align: center;
        }
        .template-1-wrapper .pricing-wrap::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--teal), var(--green));
        }
        .template-1-wrapper .price-badge {
          display: inline-block;
          background: rgba(29, 224, 128, .12);
          border: 1px solid rgba(29, 224, 128, .3);
          color: var(--green);
          font-size: .72rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; padding: 5px 14px; border-radius: 999px;
          margin-bottom: 24px;
        }
        .template-1-wrapper .price-old {
          font-size: .95rem; color: var(--muted);
          text-decoration: line-through; margin-bottom: 6px;
        }
        .template-1-wrapper .price-main {
          display: flex; align-items: flex-start;
          justify-content: center; gap: 6px;
          margin: 8px 0 24px;
        }
        .template-1-wrapper .price-cur {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem; font-weight: 700;
          color: var(--teal); padding-top: 10px;
        }
        .template-1-wrapper .price-val {
          font-family: 'Syne', sans-serif;
          font-size: 4.5rem; font-weight: 700;
          color: var(--text); line-height: 1;
        }
        .template-1-wrapper .price-cents {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem; font-weight: 700;
          color: var(--muted); padding-top: 10px;
        }
        .template-1-wrapper .price-note {
          font-size: .85rem; color: var(--muted); margin-bottom: 32px;
        }
        .template-1-wrapper .price-features {
          list-style: none;
          display: flex; flex-direction: column; gap: 10px;
          text-align: left; margin: 28px 0;
        }
        .template-1-wrapper .price-features li {
          display: flex; align-items: center; gap: 10px;
          font-size: .88rem;
        }
        .template-1-wrapper .price-features .ck { color: var(--teal); font-size: 1rem }
        .template-1-wrapper .guarantee {
          display: flex; align-items: center; gap: 12px;
          background: rgba(29, 224, 128, .07);
          border: 1px solid rgba(29, 224, 128, .2);
          border-radius: var(--r);
          padding: 14px 18px; margin-top: 28px;
          font-size: .84rem; color: var(--muted);
          text-align: left;
        }
        .template-1-wrapper .guarantee .shield { font-size: 1.6rem }
        .template-1-wrapper #bonus {
          padding: 90px 0;
          background: var(--bg);
        }
        .template-1-wrapper .bonus-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 20px; margin-top: 48px;
        }
        .template-1-wrapper .bonus-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 28px 22px;
          transition: all .25s;
          position: relative; overflow: hidden;
        }
        .template-1-wrapper .bonus-card::before {
          content: 'BÔNUS'; position: absolute;
          top: 14px; right: -20px;
          background: var(--teal); color: #050c0f;
          font-size: .62rem; font-weight: 700; letter-spacing: .1em;
          padding: 3px 30px;
          transform: rotate(40deg);
        }
        .template-1-wrapper .bonus-card:hover { border-color: var(--teal); transform: translateY(-3px) }
        .template-1-wrapper .bonus-icon { font-size: 2rem; margin-bottom: 14px }
        .template-1-wrapper .bonus-card h4 {
          font-family: 'Syne', sans-serif;
          font-size: .98rem; font-weight: 700; margin-bottom: 8px;
        }
        .template-1-wrapper .bonus-card p { font-size: .82rem; color: var(--muted) }
        .template-1-wrapper .bonus-val {
          margin-top: 14px;
          font-size: .8rem; color: var(--green); font-weight: 700;
        }
        .template-1-wrapper #faq {
          padding: 90px 0;
          background: var(--bg2);
        }
        .template-1-wrapper #faq .container { text-align: center }
        .template-1-wrapper .faq-wrap {
          max-width: 720px; margin: 48px auto 0;
          display: flex; flex-direction: column; gap: 12px;
          text-align: left;
        }
        .template-1-wrapper .faq-item {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r);
          overflow: hidden;
          transition: border-color .2s;
        }
        .template-1-wrapper .faq-item:hover { border-color: var(--teal) }
        .template-1-wrapper .faq-q {
          width: 100%; background: none; border: none;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 18px 22px;
          cursor: pointer; color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: .93rem; font-weight: 600;
          text-align: left;
        }
        .template-1-wrapper .faq-q .arr {
          color: var(--teal); font-size: 1.2rem; flex-shrink: 0;
          transition: transform .25s;
        }
        .template-1-wrapper .faq-a {
          font-size: .86rem; color: var(--muted);
          padding: 0 22px 18px; line-height: 1.75;
          display: none;
        }
        .template-1-wrapper .faq-item.open .faq-a { display: block }
        .template-1-wrapper .faq-item.open .arr { transform: rotate(45deg) }
        .template-1-wrapper #cta-final {
          padding: 100px 0;
          background: var(--bg);
          position: relative; overflow: hidden;
          text-align: center;
        }
        .template-1-wrapper #cta-final::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,192,.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .template-1-wrapper #cta-final h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700; line-height: 1.15;
          max-width: 700px; margin: 0 auto 20px;
        }
        .template-1-wrapper #cta-final p {
          font-size: 1rem; color: var(--muted);
          max-width: 520px; margin: 0 auto 36px;
        }
        .template-1-wrapper footer {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          padding: 48px 0 32px;
        }
        .template-1-wrapper .footer-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 40px; margin-bottom: 40px;
        }
        .template-1-wrapper .footer-brand img { height: 28px; margin-bottom: 14px }
        .template-1-wrapper .footer-brand p { font-size: .82rem; color: var(--muted) }
        .template-1-wrapper .footer-col h5 {
          font-family: 'Syne', sans-serif;
          font-size: .8rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--teal); margin-bottom: 14px;
        }
        .template-1-wrapper .footer-col a {
          display: block; text-decoration: none;
          font-size: .84rem; color: var(--muted);
          margin-bottom: 8px; transition: color .2s;
        }
        .template-1-wrapper .footer-col a:hover { color: var(--text) }
        .template-1-wrapper .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: 24px;
          display: flex; align-items: center; justify-content: space-between;
          font-size: .78rem; color: var(--muted);
        }
        .template-1-wrapper .footer-logo-small { height: 22px }
        @media(max-width:860px) {
          .template-1-wrapper .hero-grid, .template-1-wrapper .method-grid, .template-1-wrapper .instructor-grid, .template-1-wrapper .forwho-grid { grid-template-columns: 1fr }
          .template-1-wrapper .pain-grid, .template-1-wrapper .modules-grid, .template-1-wrapper .testi-grid, .template-1-wrapper .bonus-grid { grid-template-columns: 1fr 1fr }
          .template-1-wrapper .footer-grid { grid-template-columns: 1fr 1fr }
          .template-1-wrapper .hero-img-wrap { max-height: 340px; overflow: hidden }
          .template-1-wrapper .hero-img-wrap img { max-height: 320px }
          .template-1-wrapper .hero-copy { padding-bottom: 40px }
        }
        @media(max-width:560px) {
          .template-1-wrapper .pain-grid, .template-1-wrapper .modules-grid, .template-1-wrapper .testi-grid, .template-1-wrapper .bonus-grid { grid-template-columns: 1fr }
          .template-1-wrapper .footer-grid { grid-template-columns: 1fr }
          .template-1-wrapper .pricing-wrap { padding: 28px 20px }
          .template-1-wrapper .price-val { font-size: 3.5rem }
          .template-1-wrapper .hero-stats { flex-wrap: wrap; gap: 20px }
        }
      ` }} />
      
      <nav>
        <div className="container">
          <a href="#contato" className="btn-primary nav-cta">Entrar em Contato →</a>
        </div>
      </nav>

      <section id="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy reveal">
              <div className="badge">✦ Portfólio Profissional</div>
              <h1>{hero?.title?.split(" ")[0]}<br /><span className="teal">{hero?.title?.split(" ").slice(1).join(" ")}</span></h1>
              <p>{hero?.subtitle || "Transformando visões em realidade digital com foco em performance, design e resultados reais."}</p>
              <a href="#modules" className="btn-primary">Ver Especialidades →</a>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span>10+</span>
                  <small>Anos de Exp.</small>
                </div>
                <div className="hero-stat">
                  <span>500+</span>
                  <small>Clientes</small>
                </div>
                <div className="hero-stat">
                  <span>100%</span>
                  <small>Dedicação</small>
                </div>
              </div>
            </div>
            <div className="hero-img-wrap reveal">
              <img src={hero?.backgroundImage || "https://images.unsplash.com/photo-1497366216548-375260702979?auto=format&fit=crop&w=1000&q=80"} alt="Hero" />
            </div>
          </div>
        </div>
        <div className="hero-banner">
          <div className="container">
            <div className="hb-item"><span className="dot"></span>Design de Alta Performance</div>
            <div className="hb-item"><span className="dot"></span>Estratégias Digitais</div>
            <div className="hb-item"><span className="dot"></span>Foco em Conversão</div>
            <div className="hb-item"><span className="dot"></span>Desenvolvimento Moderno</div>
            <div className="hb-item"><span className="dot"></span>Análise de Resultados</div>
          </div>
        </div>
      </section>

      <section id="pain">
        <div className="container">
          <div className="badge">Minha Abordagem</div>
          <h2 className="section-title">Design & Estratégia<br /><span className="teal">focados em resultados</span></h2>
          <p className="section-sub">Não acredito em soluções genéricas. Cada projeto é tratado como único, unindo estética refinada com objetivos de negócio claros.</p>
          <div className="pain-grid">
            <div className="pain-card reveal">
              <div className="pain-icon">🎯</div>
              <h4>Foco no Objetivo</h4>
              <p>Cada elemento visual é pensado para guiar o usuário e maximizar as conversões do seu negócio.</p>
            </div>
            <div className="pain-card reveal">
              <div className="pain-icon">📈</div>
              <h4>Alta Performance</h4>
              <p>Código limpo e otimizado para garantir que seu site seja rápido, seguro e eficiente em qualquer dispositivo.</p>
            </div>
            <div className="pain-card reveal">
              <div className="pain-icon">🎨</div>
              <h4>Estética Premium</h4>
              <p>Design moderno e sofisticado que eleva a percepção de valor da sua marca no mercado digital.</p>
            </div>
            <div className="pain-card reveal">
              <div className="pain-icon">⏳</div>
              <h4>Entrega Ágil</h4>
              <p>Processo de trabalho organizado com cronogramas claros para que seu projeto entre no ar no prazo certo.</p>
            </div>
            <div className="pain-card reveal">
              <div className="pain-icon">🤝</div>
              <h4>Parceria Real</h4>
              <p>Acompanhamento próximo durante todo o desenvolvimento para garantir que a visão final seja alcançada.</p>
            </div>
            <div className="pain-card reveal">
              <div className="pain-icon">📊</div>
              <h4>Escalabilidade</h4>
              <p>Sistemas construídos para crescer junto com a sua empresa, permitindo expansões futuras sem retrabalho.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="modules">
        <div className="container">
          <div className="modules-header reveal">
            <div className="badge">Minhas Especialidades</div>
            <h2 className="section-title">Áreas de <span className="teal">Atuação</span></h2>
            <p className="section-sub">Soluções especializadas com foco em qualidade, design moderno e entrega de valor real para o cliente.</p>
          </div>
          <div className="modules-grid">
            {categories.length > 0 ? (
              categories.map((cat, i) => (
                <div className="module-card reveal" key={cat._id || i}>
                  <div className="mod-num">Especialidade {String(i + 1).padStart(2, "0")}</div>
                  <h4>{cat.name}</h4>
                  <p>{cat.description || "Desenvolvimento de soluções com foco em alta performance e experiência do usuário."}</p>
                </div>
              ))
            ) : (
              <>
                <div className="module-card reveal">
                  <div className="mod-num">Especialidade 01</div>
                  <h4>Desenvolvimento Web</h4>
                  <p>Criação de sites e aplicações modernas, responsivas e otimizadas para todos os dispositivos.</p>
                </div>
                <div className="module-card reveal">
                  <div className="mod-num">Especialidade 02</div>
                  <h4>Design de Interface (UI/UX)</h4>
                  <p>Foco na experiência do usuário para criar interfaces intuitivas e visualmente impactantes.</p>
                </div>
                <div className="module-card reveal">
                  <div className="mod-num">Especialidade 03</div>
                  <h4>Estratégia Digital</h4>
                  <p>Planejamento estratégico para posicionar sua marca e atrair o público certo no ambiente digital.</p>
                </div>
                <div className="module-card reveal">
                  <div className="mod-num">Especialidade 04</div>
                  <h4>Otimização de Performance</h4>
                  <p>Melhoria de velocidade e SEO para garantir que seu projeto seja encontrado e carregue instantaneamente.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="forwho">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="badge">Perfil Profissional</div>
            <h2 className="section-title">Comprometimento com <span className="teal">resultados reais</span>,<br />estética e função</h2>
          </div>
          <div className="forwho-grid">
            <div className="fw-col reveal">
              <h3 className="green">✓ O que entrego</h3>
              <ul className="fw-list">
                <li><span className="ico">✦</span>Desenvolvimento de sites modernos e responsivos</li>
                <li><span className="ico">✦</span>Criação de interfaces focadas na experiência do usuário</li>
                <li><span className="ico">✦</span>Otimização de performance e carregamento rápido</li>
                <li><span className="ico">✦</span>Consultoria técnica para viabilizar ideias complexas</li>
                <li><span className="ico">✦</span>Cuidado rigoroso com cada detalhe visual e funcional</li>
              </ul>
            </div>
            <div className="fw-col reveal">
              <h3 style={{ color: "#e05555" }}>✗ O que não faço</h3>
              <ul className="fw-list">
                <li><span className="ico no">✗</span>Entregas superficiais ou sem embasamento técnico</li>
                <li><span className="ico no">✗</span>Design genérico baseado apenas em templates prontos</li>
                <li><span className="ico no">✗</span>Promessas de resultados irreais sem estratégia</li>
                <li><span className="ico no">✗</span>Suporte inexistente após a entrega do projeto</li>
                <li><span className="ico no">✗</span>Negligência com acessibilidade e performance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="method">
        <div className="container">
          <div className="method-grid">
            <div className="reveal">
              <div className="badge">O Processo</div>
              <h2 className="section-title">Quatro passos para ver <span className="teal">resultado real</span></h2>
              <div className="method-steps">
                <div className="step">
                  <div className="step-num">01</div>
                  <div className="step-body">
                    <h4>Fundamentos sólidos</h4>
                    <p>Entenda a lógica das plataformas antes de gastar R$1 em anúncio.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-num">02</div>
                  <div className="step-body">
                    <h4>Estrutura com método</h4>
                    <p>Monte campanhas com o framework validado do Método Supremo 7.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-num">03</div>
                  <div className="step-body">
                    <h4>Analise e otimize</h4>
                    <p>Use dados reais para tomar decisões e eliminar o desperdício.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-num">04</div>
                  <div className="step-body">
                    <h4>Escale com confiança</h4>
                    <p>Aumente o investimento sabendo exatamente quando e como fazê-lo.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="method-visual reveal">
              <div className="mv-row">
                <div className="mv-icon">🎯</div>
                <div><span>Objetivo correto</span><small>Campanha alinhada com a meta de negócio</small></div>
              </div>
              <div className="mv-row">
                <div className="mv-icon">👥</div>
                <div><span>Público qualificado</span><small>Segmentação que encontra quem vai comprar</small></div>
              </div>
              <div className="mv-row">
                <div className="mv-icon">📝</div>
                <div><span>Criativo persuasivo</span><small>Anúncio que para o scroll e gera clique</small></div>
              </div>
              <div className="mv-row">
                <div className="mv-icon">📈</div>
                <div><span>Otimização contínua</span><small>Dados guiando cada decisão de investimento</small></div>
              </div>
              <div className="mv-row">
                <div className="mv-icon">🚀</div>
                <div><span>Escala sustentável</span><small>Aumento de orçamento sem quebrar a campanha</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="badge">Resultados Reais</div>
            <h2 className="section-title">Palavras de quem já <span className="teal">passou por esse caminho</span></h2>
          </div>
          <div className="testi-grid">
            <div className="testi-card reveal">
              <div className="stars">★★★★★</div>
              <p className="testi-text">Em dois meses eu já tinha clientes pagantes e um processo claro. Antes ficava perdido tentando copiar estratégias aleatórias da internet.</p>
              <div className="testi-author">
                <div className="testi-avatar">RV</div>
                <div><div className="testi-name">Rafael V.</div><div className="testi-role">Gestor de Tráfego</div></div>
              </div>
            </div>
            <div className="testi-card reveal">
              <div className="stars">★★★★★</div>
              <p className="testi-text">Finalmente entendi o que estava errado nas minhas campanhas. O ROAS saiu de 1,2 para 4,8 em menos de 30 dias aplicando o método.</p>
              <div className="testi-author">
                <div className="testi-avatar">CM</div>
                <div><div className="testi-name">Camila M.</div><div className="testi-role">E-commerce Owner</div></div>
              </div>
            </div>
            <div className="testi-card reveal">
              <div className="stars">★★★★★</div>
              <p className="testi-text">O módulo de análise de métricas mudou minha cabeça. Parei de olhar só para curtidas e comecei a focar em números que pagam as contas.</p>
              <div className="testi-author">
                <div className="testi-avatar">LP</div>
                <div><div className="testi-name">Lucas P.</div><div className="testi-role">Empreendedor Digital</div></div>
              </div>
            </div>
            <div className="testi-card reveal">
              <div className="stars">★★★★★</div>
              <p className="testi-text">Passei de estagiário para head de mídia em 8 meses. O Método Supremo 7 foi o que me deu base técnica e confiança para crescer.</p>
              <div className="testi-author">
                <div className="testi-avatar">FO</div>
                <div><div className="testi-name">Felipe O.</div><div className="testi-role">Head de Mídia</div></div>
              </div>
            </div>
            <div className="testi-card reveal">
              <div className="stars">★★★★★</div>
              <p className="testi-text">Tinha medo de investir em curso. Recuperei o investimento na primeira semana aplicando apenas o que aprendi no módulo 3.</p>
              <div className="testi-author">
                <div className="testi-avatar">AS</div>
                <div><div className="testi-name">Ana S.</div><div className="testi-role">Afiliada Digital</div></div>
              </div>
            </div>
            <div className="testi-card reveal">
              <div className="stars">★★★★★</div>
              <p className="testi-text">O suporte da comunidade é diferente. Não é só o curso — é um grupo de pessoas sérias comprometidas com resultado. Vale cada centavo.</p>
              <div className="testi-author">
                <div className="testi-avatar">MR</div>
                <div><div className="testi-name">Marcelo R.</div><div className="testi-role">Infoprodutor</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="instructor">
        <div className="container">
          <div className="instructor-grid">
            <div className="instructor-img reveal">
              <img src={hero?.backgroundImage || "https://images.unsplash.com/photo-1497366216548-375260702979?auto=format&fit=crop&w=1000&q=80"} alt="Instructor" />
            </div>
            <div className="instructor-copy reveal">
              <div className="badge">Seu mentor</div>
              <h2 className="section-title">Quem vai te guiar<br />nessa jornada</h2>
              <div className="sub-name teal">{hero?.title || "Pablo Azevedo"}</div>
              <div
                className="instructor-desc"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about?.description || "Especialista em tráfego pago com mais de 10 anos de experiência em gestão de campanhas para negócios locais, e-commerces e infoprodutores.") }}
              />
              <div className="instructor-stats">
                {about && about.features && about.features.length > 0 ? (
                  about.features.slice(0, 3).map((f, i) => (
                    <div className="i-stat" key={i}>
                      <span>{f.title}</span>
                      <small>{f.description.substring(0, 20)}...</small>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="i-stat"><span>R$12M+</span><small>Em verba gerenciada</small></div>
                    <div className="i-stat"><span>3.200+</span><small>Alunos formados</small></div>
                    <div className="i-stat"><span>10+</span><small>Anos de mercado</small></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <section id="bonus">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="badge">Habilidades Exclusivas</div>
            <h2 className="section-title">Você ainda conta com <span className="teal">habilidades exclusivas</span></h2>
            <p className="section-sub">Competências técnicas e habilidades que complementam e aceleram a entrega do seu projeto.</p>
          </div>
          <div className="bonus-grid">
            {about && about.features && about.features.length > 0 ? (
              about.features.map((feature, i) => {
                const icons = ['🚀', '🛠️ ', '🎨', '⚡', '🎯', '📈', '💎', '🛡️ '];
                const selectedIcon = feature.icon || icons[i % icons.length];
                return (
                  <div className="bonus-card reveal" key={i}>
                    <div className="bonus-icon">{selectedIcon}</div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                );
              })
            ) : (
              <>
                <div className="bonus-card reveal">
                  <div className="bonus-icon">🛠️ </div>
                  <h4>Desenvolvimento Fullstack</h4>
                  <p>Criação de soluções completas, do front-end ao back-end, com foco em escalabilidade.</p>
                </div>
                <div className="bonus-card reveal">
                  <div className="bonus-icon">🎨</div>
                  <h4>UI/UX Design</h4>
                  <p>Design de interfaces intuitivas e focadas na melhor experiência para o usuário final.</p>
                </div>
                <div className="bonus-card reveal">
                  <div className="bonus-icon">⚡</div>
                  <h4>Otimização de Performance</h4>
                  <p>Técnicas avançadas de SEO e performance para garantir carregamentos instantâneos.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="container">
          <div className="badge">Dúvidas</div>
          <h2 className="section-title">Ainda tem dúvida? <span className="teal">A gente responde</span></h2>
          <div className="faq-wrap">
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Preciso de experiência prévia com anúncios?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">Não. O curso começa do zero e vai até o nível avançado. Mesmo sem nenhuma experiência com plataformas de anúncios você vai acompanhar tranquilamente.</div>
            </div>
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Quanto tempo tenho acesso ao conteúdo?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">O acesso é vitalício. Você assiste no seu ritmo e, sempre que o curso receber atualizações, você recebe automaticamente — sem pagar nada a mais.</div>
            </div>
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Preciso investir em anúncios para fazer o curso?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">Não é obrigatório. Você pode aprender toda a teoria e estrutura primeiro. Mas para praticar recomendamos um orçamento inicial mínimo de R$10/dia para testar as campanhas.</div>
            </div>
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                O curso tem certificado?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">Sim! Ao concluir todos os módulos você recebe um certificado digital que pode ser adicionado ao seu LinkedIn e portfólio profissional.</div>
            </div>
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Funciona para qualquer nicho de mercado?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">Sim. Os princípios de tráfego pago ensinados no Método Supremo 7 se aplicam a e-commerce, infoprodutos, negócios locais, prestadores de serviço e muito mais.</div>
            </div>
            <div className="faq-item reveal" onClick={(e) => {
              const item = e.currentTarget;
              const isOpen = item.classList.contains("open");
              document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("open"));
              if(!isOpen) item.classList.add("open");
            }}>
              <button className="faq-q">
                Como funciona a garantia?
                <span className="arr">+</span>
              </button>
              <div className="faq-a">Você tem 7 dias após a compra para solicitar reembolso integral, sem nenhuma justificativa necessária. É só entrar em contato com nosso suporte e o valor é devolvido na forma de pagamento original.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta-final">
        <div className="container">
          <div className="reveal">
            <div className="badge">Última chamada</div>
            <h2 className="section-title">Pare de queimar verba no escuro.<br /><span className="teal">Aprenda tráfego pago do jeito certo.</span></h2>
            <p>Mais de 3.200 alunos já tomaram essa decisão. Chegou a sua vez de parar de adivinhar e começar a crescer com método.</p>
            <a href="#pricing" className="btn-primary" style={{ fontSize: "1.05rem", padding: "18px 40px" }}>
              Garantir minha vaga por R$ 97 →
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <p>Formando profissionais de tráfego pago com método, prática e resultado real desde 2019.</p>
            </div>
            <div className="footer-col">
              <h5>Conteúdo</h5>
              <a href="#modules">Módulos</a>
              <a href="#instructor">Instrutor</a>
              <a href="#bonus">Bônus</a>
              <a href="#pricing">Preço</a>
            </div>
            <div className="footer-col">
              <h5>Suporte</h5>
              <a href="#faq">Dúvidas</a>
              <a href="#">Política de privacidade</a>
              <a href="#">Termos de uso</a>
              <a href="#contato">Contato</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {hero?.title || "Pablo Azevedo"}. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}