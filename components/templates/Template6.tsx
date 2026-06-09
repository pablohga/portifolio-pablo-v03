"use client";

import React, { useEffect, useState } from "react";
import { Hero } from "@/types/hero";
import { About } from "@/types/about";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { ProjectsSection } from "@/components/projects-section";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatName } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";

interface TemplateProps {
  userId: string;
  categories: Category[];
  projects: Project[];
}

export default function Template3({ userId, categories, projects }: TemplateProps) {
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

  useEffect(() => {
  if (loading) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal, .reveal-l, .reveal-r").forEach((el) =>
    obs.observe(el)
  );

  return () => obs.disconnect();
}, [loading]);

  const { firstName, lastName } = formatName(hero?.title || "Freelancer Digital");
  const fullName = hero?.title || "Freelancer Digital";

  return (
    <div className="template-3-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');

        :root {
          --cream:   #f5f2ec;
          --cream2:  #ede9e0;
          --white:   #ffffff;
          --olive:   #2e5d3a;
          --olive2:  #3d7a4e;
          --olive3:  #4e9663;
          --oliveL:  rgba(46,93,58,.08);
          --oliveG:  rgba(46,93,58,.18);
          --dark:    #1a2820;
          --dark2:   #22342a;
          --dark3:   #2c4336;
          --text:    #1a2820;
          --muted:   #6b7f74;
          --border:  rgba(46,93,58,.15);
          --r:       10px;
          --r2:      18px;
          --r3:      28px;
        }

        .template-3-wrapper {
          font-family: 'Nunito Sans', sans-serif;
          background: var(--cream);
          color: var(--text);
          line-height: 1.65;
          overflow-x: hidden;
        }

        .template-3-wrapper *, .template-3-wrapper *::before, .template-3-wrapper *::after { box-sizing: border-box; margin: 0; padding: 0 }
        .template-3-wrapper html { scroll-behavior: smooth }
        .template-3-wrapper .container { max-width: 1060px; margin: 0 auto; padding: 0 28px }
        .template-3-wrapper .olive { color: var(--olive) }
        .template-3-wrapper .muted { color: var(--muted) }

        .template-3-wrapper .badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--oliveL);
          border: 1px solid var(--oliveG);
          color: var(--olive);
          font-size: .72rem; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; padding: 5px 14px; border-radius: 999px;
          margin-bottom: 18px;
        }
        .template-3-wrapper .badge::before { content: '◆'; font-size: .6rem }

        .template-3-wrapper .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--olive); color: #fff;
          font-family: 'Nunito Sans', sans-serif;
          font-weight: 700; font-size: .9rem;
          padding: 13px 28px; border-radius: var(--r);
          border: none; cursor: pointer; text-decoration: none;
          transition: all .22s ease;
          box-shadow: 0 4px 20px rgba(46,93,58,.3);
        }
        .template-3-wrapper .btn-primary:hover { background: var(--olive2); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(46,93,58,.4) }

        .template-3-wrapper .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: var(--olive);
          font-family: 'Nunito Sans', sans-serif;
          font-weight: 700; font-size: .9rem;
          padding: 12px 26px; border-radius: var(--r);
          border: 2px solid var(--olive);
          cursor: pointer; text-decoration: none;
          transition: all .22s ease;
        }
        .template-3-wrapper .btn-outline:hover { background: var(--oliveL) }

        .template-3-wrapper .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.7rem);
          font-weight: 700; line-height: 1.2;
          letter-spacing: -.01em;
        }
        .template-3-wrapper .section-sub {
          font-size: 1rem; color: var(--muted);
          max-width: 580px; margin-top: 12px; line-height: 1.75;
        }

        .template-3-wrapper nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(245,242,236,.94);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
          padding: 14px 0;
        }
        .template-3-wrapper nav .container { display: flex; align-items: center; justify-content: space-between; gap: 20px }
        .template-3-wrapper .nav-links { display: flex; align-items: center; gap: 28px; list-style: none }
        .template-3-wrapper .nav-links a {
          text-decoration: none; font-size: .88rem;
          font-weight: 600; color: var(--text);
          transition: color .18s;
        }
        .template-3-wrapper .nav-links a:hover { color: var(--olive) }
        .template-3-wrapper .nav-cta { padding: 10px 22px; font-size: .84rem }

        .template-3-wrapper #hero {
          background: var(--cream);
          padding: 80px 0 0;
          overflow: hidden;
          position: relative;
        }
        .template-3-wrapper #hero::before {
          content: ''; position: absolute;
          top: -80px; right: -120px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(46,93,58,.08) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .template-3-wrapper .hero-grid {
          display: grid; grid-template-columns: 1.05fr .95fr;
          gap: 40px; align-items: flex-end;
        }
        .template-3-wrapper .hero-copy { padding-bottom: 80px }
        .template-3-wrapper .hero-copy h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.1rem, 4.2vw, 3.4rem);
          font-weight: 700; line-height: 1.1;
          margin-bottom: 20px;
        }
        .template-3-wrapper .hero-copy h1 em {
          font-style: normal;
          color: var(--olive);
        }
        .template-3-wrapper .hero-copy p {
          font-size: 1.02rem; color: var(--muted);
          margin-bottom: 32px; max-width: 480px; line-height: 1.75;
        }
        .template-3-wrapper .hero-btns { display: flex; gap: 14px; flex-wrap: wrap }
        .template-3-wrapper .hero-img-wrap {
          position: relative; align-self: flex-end;
          display: flex; justify-content: flex-end;
        }
        .template-3-wrapper .hero-img-box {
          position: relative;
          width: 100%; max-width: 420px;
        }
        .template-3-wrapper .hero-img-box::before {
          content: ''; position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(46,93,58,.12) 0%, transparent 50%);
          border-radius: var(--r3) var(--r3) 0 0;
          z-index: 1;
        }
        .template-3-wrapper .hero-img-box img {
          width: 100%; object-fit: cover;
          object-position: top;
          border-radius: var(--r3) var(--r3) 0 0;
          display: block;
          max-height: 540px;
        }
        .template-3-wrapper .hero-chip {
          position: absolute;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 12px 18px;
          box-shadow: 0 8px 30px rgba(0,0,0,.1);
          display: flex; align-items: center; gap: 10px;
          font-size: .82rem; font-weight: 700;
          z-index: 2; white-space: nowrap;
        }
        .template-3-wrapper .hero-chip.c1 { top: 28px; left: -28px }
        .template-3-wrapper .hero-chip.c2 { bottom: 32px; left: -20px }
        .template-3-wrapper .chip-icon {
          width: 34px; height: 34px; border-radius: 8px;
          background: var(--oliveL);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; flex-shrink: 0;
        }
        .template-3-wrapper .hero-stripe {
          background: var(--dark);
          margin-top: 0;
          padding: 16px 0;
        }
        .template-3-wrapper .stripe-inner {
          display: flex; align-items: center; justify-content: center;
          gap: 40px; flex-wrap: wrap;
        }
        .template-3-wrapper .stripe-item {
          display: flex; align-items: center; gap: 10px;
          font-size: .82rem; color: rgba(255,255,255,.55);
          white-space: nowrap;
        }
        .template-3-wrapper .stripe-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--olive3); flex-shrink: 0 }

        .template-3-wrapper #about {
          padding: 96px 0;
          background: var(--white);
        }
        .template-3-wrapper .about-grid {
          display: grid; grid-template-columns: 1fr 1.1fr;
          gap: 64px; align-items: center;
        }
        .template-3-wrapper .about-img-wrap { position: relative }
        .template-3-wrapper .about-img-card {
          background: var(--cream);
          border-radius: var(--r3);
          overflow: hidden;
          position: relative;
        }
        .template-3-wrapper .about-img-card img {
          width: 100%; object-fit: cover;
          object-position: top center;
          max-height: 520px; display: block;
        }
        .template-3-wrapper .about-name-tag {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(26,40,32,.82);
          backdrop-filter: blur(8px);
          padding: 18px 22px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .template-3-wrapper .about-name-tag strong { color: #fff; font-size: .95rem; font-weight: 700 }
        .template-3-wrapper .about-name-tag span { font-size: .78rem; color: rgba(255,255,255,.6) }
        .template-3-wrapper .about-verified {
          background: var(--olive3);
          color: #fff; font-size: .7rem; font-weight: 700;
          padding: 4px 10px; border-radius: 999px; letter-spacing: .06em;
        }
        .template-3-wrapper .about-copy .section-title { margin-bottom: 14px }
        .template-3-wrapper .about-copy > p {
          font-size: .95rem; color: var(--muted);
          margin-bottom: 28px; line-height: 1.8;
        }
        .template-3-wrapper .check-list { list-style: none; display: flex; flex-direction: column; gap: 13px; margin-bottom: 28px }
        .template-3-wrapper .check-list li {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: .9rem; color: var(--text);
        }
        .template-3-wrapper .check-list .ck {
          width: 22px; height: 22px; flex-shrink: 0;
          background: var(--oliveL); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--olive); font-size: .75rem; margin-top: 1px;
        }

        .template-3-wrapper #services {
          padding: 96px 0;
          background: var(--dark);
        }
        .template-3-wrapper #services .badge {
          background: rgba(255,255,255,.07);
          border-color: rgba(255,255,255,.15);
          color: rgba(255,255,255,.7);
        }
        .template-3-wrapper #services .section-title { color: #fff }
        .template-3-wrapper #services .section-sub { color: rgba(255,255,255,.5); max-width: none }
        .template-3-wrapper .services-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 24px; margin-bottom: 52px; flex-wrap: wrap;
        }
        .template-3-wrapper .services-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .template-3-wrapper .service-card {
          background: var(--dark2);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: var(--r2);
          padding: 30px 26px;
          transition: all .25s;
          position: relative; overflow: hidden;
        }
        .template-3-wrapper .service-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--olive3), transparent);
          opacity: 0; transition: opacity .25s;
        }
        .template-3-wrapper .service-card:hover { border-color: rgba(78,150,99,.3); transform: translateY(-3px) }
        .template-3-wrapper .service-card:hover::before { opacity: 1 }
        .template-3-wrapper .service-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: var(--dark3);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 18px;
        }
        .template-3-wrapper .service-card h4 {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 700;
          color: #fff; margin-bottom: 10px;
        }
        .template-3-wrapper .service-card p { font-size: .84rem; color: rgba(255,255,255,.45); line-height: 1.7 }
        .template-3-wrapper .service-tag {
          display: inline-block;
          background: rgba(78,150,99,.12);
          color: var(--olive3);
          font-size: .72rem; font-weight: 700;
          padding: 3px 10px; border-radius: 999px;
          margin-top: 14px;
        }

        .template-3-wrapper #process {
          padding: 96px 0;
          background: var(--cream2);
        }
        .template-3-wrapper #process .container { text-align: center }
        .template-3-wrapper .process-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0; margin-top: 52px; position: relative;
        }
        .template-3-wrapper .process-grid::before {
          content: ''; position: absolute;
          top: 28px; left: calc(12.5%); right: calc(12.5%);
          height: 2px;
          background: linear-gradient(90deg, var(--olive), var(--olive2), var(--olive3));
          z-index: 0;
        }
        .template-3-wrapper .process-step {
          position: relative; z-index: 1;
          padding: 0 16px;
        }
        .template-3-wrapper .ps-num {
          width: 56px; height: 56px; border-radius: 50%;
          background: var(--white);
          border: 2px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 22px;
          font-family: 'Playfair Display', serif;
          font-size: 1rem; font-weight: 700; color: var(--olive);
          position: relative; z-index: 1;
          transition: all .25s;
        }
        .template-3-wrapper .process-step:hover .ps-num {
          background: var(--olive); color: #fff; border-color: var(--olive);
        }
        .template-3-wrapper .ps-icon { font-size: 1.1rem; margin-bottom: 10px }
        .template-3-wrapper .process-step h4 {
          font-family: 'Playfair Display', serif;
          font-size: .95rem; font-weight: 700; margin-bottom: 8px;
        }
        .template-3-wrapper .process-step p { font-size: .8rem; color: var(--muted); line-height: 1.65 }

        .template-3-wrapper #curriculum {
          padding: 96px 0;
          background: var(--dark);
        }
        .template-3-wrapper .cv-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .template-3-wrapper .cv-card {
          background: var(--dark2);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: var(--r2);
          padding: 28px;
        }
        .template-3-wrapper .cv-card-title {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 22px;
        }
        .template-3-wrapper .cv-card-title .ico { font-size: 1.1rem }
        .template-3-wrapper .cv-card-title span {
          font-family: 'Playfair Display', serif;
          font-size: .95rem; font-weight: 700; color: #fff;
        }
        .template-3-wrapper .cv-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,.05);
          font-size: .84rem; color: rgba(255,255,255,.55);
          line-height: 1.55;
        }
        .template-3-wrapper .cv-item:last-child { border-bottom: none }
        .template-3-wrapper .cv-item .ck { color: var(--olive3); flex-shrink: 0; margin-top: 1px }
        .template-3-wrapper .cv-item strong { color: rgba(255,255,255,.85); display: block }

        .template-3-wrapper #howitworks {
          padding: 96px 0;
          background: var(--white);
        }
        .template-3-wrapper .hiw-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 56px; align-items: center;
        }
        .template-3-wrapper .hiw-cards {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .template-3-wrapper .hiw-card {
          background: var(--cream);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 22px 18px;
          transition: all .25s;
        }
        .template-3-wrapper .hiw-card:hover { border-color: var(--olive); background: var(--oliveL) }
        .template-3-wrapper .hiw-card .ico { font-size: 1.5rem; margin-bottom: 12px }
        .template-3-wrapper .hiw-card h5 {
          font-family: 'Playfair Display', serif;
          font-size: .9rem; font-weight: 700; margin-bottom: 6px;
        }
        .template-3-wrapper .hiw-card p { font-size: .78rem; color: var(--muted); line-height: 1.6 }
        .template-3-wrapper .hiw-card.accent {
          background: var(--olive); border-color: var(--olive);
          grid-column: span 2;
          display: flex; align-items: center; gap: 14px;
          padding: 18px 22px;
        }
        .template-3-wrapper .hiw-card.accent .ico { margin-bottom: 0; font-size: 1.6rem }
        .template-3-wrapper .hiw-card.accent h5 { color: #fff; margin-bottom: 2px }
        .template-3-wrapper .hiw-card.accent p { color: rgba(255,255,255,.7) }

        .template-3-wrapper #cta-banner {
          background: linear-gradient(135deg, var(--olive) 0%, var(--dark2) 100%);
          padding: 72px 0;
        }
        .template-3-wrapper .cta-inner {
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px; flex-wrap: wrap;
        }
        .template-3-wrapper .cta-inner h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          font-weight: 700; color: #fff;
          max-width: 520px; line-height: 1.25;
        }
        .template-3-wrapper .cta-inner p {
          font-size: .95rem; color: rgba(255,255,255,.6);
          max-width: 440px; margin-top: 10px;
        }
        .template-3-wrapper .btn-white {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: var(--olive);
          font-family: 'Nunito Sans', sans-serif;
          font-weight: 700; font-size: .95rem;
          padding: 14px 30px; border-radius: var(--r);
          border: none; cursor: pointer; text-decoration: none;
          transition: all .22s; white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0,0,0,.2);
        }
        .template-3-wrapper .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,.25) }

        .template-3-wrapper #contact {
          padding: 96px 0;
          background: var(--cream);
        }
        .template-3-wrapper .contact-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 56px; align-items: center;
        }
        .template-3-wrapper .contact-info h2 { margin-bottom: 12px }
        .template-3-wrapper .contact-info .section-sub { margin-bottom: 36px }
        .template-3-wrapper .contact-items {
          display: flex; flex-direction: column; gap: 18px;
        }
        .template-3-wrapper .contact-item {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 20px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          transition: border-color .2s;
        }
        .template-3-wrapper .contact-item:hover { border-color: var(--olive) }
        .template-3-wrapper .contact-icon {
          width: 42px; height: 42px; flex-shrink: 0;
          background: var(--oliveL); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
        }
        .template-3-wrapper .contact-item span { font-size: .84rem; font-weight: 700; display: block }
        .template-3-wrapper .contact-item small { font-size: .78rem; color: var(--muted) }

        .template-3-wrapper .chat-mock {
          background: var(--dark);
          border-radius: var(--r3);
          padding: 24px;
          box-shadow: 0 24px 64px rgba(0,0,0,.2);
        }
        .template-3-wrapper .chat-header {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .template-3-wrapper .chat-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--olive2);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; flex-shrink: 0; overflow: hidden;
        }
        .template-3-wrapper .chat-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: top }
        .template-3-wrapper .chat-hname { font-size: .9rem; font-weight: 700; color: #fff }
        .template-3-wrapper .chat-hstatus { font-size: .72rem; color: var(--olive3); display: flex; align-items: center; gap: 5px }
        .template-3-wrapper .chat-hstatus::before { content: '●' }
        .template-3-wrapper .chat-msgs { display: flex; flex-direction: column; gap: 12px }
        .template-3-wrapper .msg { max-width: 80%; border-radius: 16px; padding: 11px 15px; font-size: .82rem; line-height: 1.6 }
        .template-3-wrapper .msg.in {
          background: var(--dark2);
          color: rgba(255,255,255,.75);
          border-bottom-left-radius: 4px; align-self: flex-start;
        }
        .template-3-wrapper .msg.out {
          background: var(--olive);
          color: #fff;
          border-bottom-right-radius: 4px; align-self: flex-end;
        }
        .template-3-wrapper .msg-time { font-size: .68rem; color: rgba(255,255,255,.3); margin-top: 4px; text-align: right }
        .template-3-wrapper .chat-input {
          display: flex; align-items: center; gap: 10px;
          margin-top: 18px;
          background: var(--dark2);
          border-radius: 12px; padding: 10px 14px;
        }
        .template-3-wrapper .chat-input span { flex: 1; font-size: .8rem; color: rgba(255,255,255,.25) }
        .template-3-wrapper .send-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--olive);
          display: flex; align-items: center; justify-content: center;
          font-size: .85rem; flex-shrink: 0; cursor: pointer;
        }

        .template-3-wrapper footer {
          background: var(--dark);
          border-top: 1px solid rgba(255,255,255,.06);
          padding: 52px 0 28px;
        }

        /* ProjectsSection Overrides for Template 3 */
        .template-3-wrapper #projects {
          background: var(--cream) !important;
          color: var(--text) !important;
          padding: 96px 0 !important;
        }
        .template-3-wrapper #projects h2 {
          font-family: 'Playfair Display', serif !important;
          color: var(--text) !important;
          text-align: center !important;
        }
        .template-3-wrapper #projects p {
          color: var(--muted) !important;
          font-family: 'Nunito Sans', sans-serif !important;
          text-align: center !important;
        }
        .template-3-wrapper #projects [role="tablist"] {
          background: var(--white) !important;
          border: 1px solid var(--border) !important;
          color: var(--text) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,.03) !important;
        }
        .template-3-wrapper #projects [role="tab"][data-state="active"] {
          background: var(--olive) !important;
          color: #fff !important;
        }
        .template-3-wrapper #projects [role="tab"] {
          color: var(--muted) !important;
        }
        .template-3-wrapper #projects .group {
          background: var(--white) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--r2) !important;
        }
        .template-3-wrapper #projects .group:hover {
          border-color: var(--olive) !important;
          box-shadow: 0 8px 24px rgba(46,93,58,.1) !important;
        }
        .template-3-wrapper #projects .group h3 {
          color: var(--text) !important;
          font-family: 'Playfair Display', serif !important;
        }
        .template-3-wrapper #projects .group h3:hover {
          color: var(--olive) !important;
        }
        .template-3-wrapper #projects .group span {
          background: var(--oliveL) !important;
          color: var(--olive) !important;
          border: 1px solid var(--oliveG) !important;
          font-size: 11px !important;
          font-weight: 600 !important;
        }
        .template-3-wrapper #projects button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .template-3-wrapper #projects .rounded-full.w-10.h-10 {
          background: var(--white) !important;
          border: 1px solid var(--border) !important;
          color: var(--olive) !important;
        }
        .template-3-wrapper .footer-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 40px; flex-wrap: wrap; margin-bottom: 40px;
        }
        .template-3-wrapper .footer-brand p { font-size: .82rem; color: rgba(255,255,255,.35); max-width: 260px; line-height: 1.7 }
        .template-3-wrapper .footer-links h5 {
          font-size: .75rem; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: rgba(255,255,255,.4);
          margin-bottom: 16px;
        }
        .template-3-wrapper .footer-links a {
          display: block; text-decoration: none;
          font-size: .84rem; color: rgba(255,255,255,.45);
          margin-bottom: 9px; transition: color .18s;
        }
        .template-3-wrapper .footer-links a:hover { color: #fff }
        .template-3-wrapper .footer-bottom {
          border-top: 1px solid rgba(255,255,255,.06);
          padding-top: 22px;
          display: flex; align-items: center; justify-content: space-between;
          font-size: .78rem; color: rgba(255,255,255,.25); flex-wrap: wrap; gap: 12px;
        }

        .template-3-wrapper .reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease }
        .template-3-wrapper .reveal.visible { opacity: 1; transform: none }
        .template-3-wrapper .reveal-l { opacity: 0; transform: translateX(-24px); transition: opacity .6s ease, transform .6s ease }
        .template-3-wrapper .reveal-l.visible { opacity: 1; transform: none }
        .template-3-wrapper .reveal-r { opacity: 0; transform: translateX(24px); transition: opacity .6s ease, transform .6s ease }
        .template-3-wrapper .reveal-r.visible { opacity: 1; transform: none }

        @media(max-width:900px) {
          .template-3-wrapper .hero-grid, .template-3-wrapper .about-grid, .template-3-wrapper .hiw-grid, .template-3-wrapper .contact-grid { grid-template-columns: 1fr }
          .template-3-wrapper .services-grid { grid-template-columns: 1fr }
          .template-3-wrapper .process-grid { grid-template-columns: 1fr 1fr; gap: 32px }
          .template-3-wrapper .process-grid::before { display: none }
          .template-3-wrapper .cv-grid { grid-template-columns: 1fr }
          .template-3-wrapper .hero-img-box { max-width: 100% }
          .template-3-wrapper .hero-chip.c1, .template-3-wrapper .hero-chip.c2 { display: none }
          .template-3-wrapper .footer-top { flex-direction: column }
          .template-3-wrapper .cta-inner { flex-direction: column }
          .template-3-wrapper nav .nav-links { display: none }
        }
        @media(max-width:560px) {
          .template-3-wrapper .process-grid { grid-template-columns: 1fr }
          .template-3-wrapper .hiw-cards { grid-template-columns: 1fr }
          .template-3-wrapper .hiw-card.accent { grid-column: span 1 }
          .template-3-wrapper .hero-copy { padding-bottom: 40px }
        }
      ` }} />

      <nav>
        <div className="container">
          <ul className="nav-links">
            <li><a href="#about">Sobre</a></li>
            <li><a href="#services">Serviços</a></li>
            <li><a href="#process">Processo</a></li>
            <li><a href="#curriculum">Experiência</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
          <a href="#contact" className="btn-primary nav-cta">Contratar agora</a>
        </div>
      </nav>

      <section id="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy reveal-l">
              <div className="badge">TEMPLATE 6 - Atendimento personalizado e estratégico</div>
              <h1>TEMPLATE 6</h1>
              <h1>
                {hero?.title?.split(" ").slice(0, -2).join(" ") || "Resultados digitais para"}<br />
                <em className="olive">{hero?.title?.split(" ").slice(-2).join(" ") || "leveza e estratégia"}</em>
              </h1>
              <p>{hero?.subtitle || "Um parceiro freelancer dedicado a transformar sua presença digital — seja com design impactante, código sólido ou campanhas que realmente vendem."}</p>
              <div className="hero-btns">
                <a href="#contact" className="btn-primary">Agendar uma conversa →</a>
                <a href="#services" className="btn-outline">Conhecer serviços</a>
              </div>
            </div>
            <div className="hero-img-wrap reveal-r">
              <div className="hero-img-box">
                <div className="hero-chip c1">
                  <div className="chip-icon">⭐</div>
                  <div><strong>4.9/5.0</strong><br /><small className="muted" style={{fontWeight: 400}}>Avaliação média</small></div>
                </div>
                <div className="hero-chip c2">
                  <div className="chip-icon">✅</div>
                  <div><strong>+120 projetos</strong><br /><small className="muted" style={{fontWeight: 400}}>Entregues com sucesso</small></div>
                </div>
                <img src={hero?.backgroundImage || "https://images.unsplash.com/photo-1497366216548-375260702979?auto=format&fit=crop&w=1000&q=80"} alt="Hero" />
              </div>
            </div>
          </div>
        </div>
        <div className="hero-stripe">
          <div className="container">
            <div className="stripe-inner">
              <div className="stripe-item"><span className="stripe-dot"></span>Design UI/UX Profissional</div>
              <div className="stripe-item"><span className="stripe-dot"></span>Desenvolvimento Web</div>
              <div className="stripe-item"><span className="stripe-dot"></span>Marketing de Performance</div>
              <div className="stripe-item"><span className="stripe-dot"></span>Identidade Visual</div>
              <div className="stripe-item"><span className="stripe-dot"></span>Gestão de Tráfego Pago</div>
            </div>
          </div>
        </div>
      </section>

      <section id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap reveal-l">
              <div className="about-img-card">
                <UserAvatar user={{ name: fullName, image: hero?.backgroundImage }} size="xl" className="w-full h-auto max-h-[520px] object-cover rounded-t-[var(--r3)]" />
                <div className="about-name-tag">
                  <div>
                    <strong>{fullName}</strong><br />
                    <span className="muted">Freelancer & Especialista Digital</span>
                  </div>
                  <span className="about-verified">✓ Verificado</span>
                </div>
              </div>
            </div>
            <div className="about-copy reveal-r">
              <div className="badge">Sobre mim</div>
              <h2 className="section-title">Cuidado digital pensado para a <em style={{fontStyle: 'italic', color: 'var(--olive)'}}>sua vida real</em></h2>
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about?.description || "Sou um freelancer digital dedicado a ajudar cada cliente a encontrar um caminho mais eficiente, sem exageros e sem fórmulas prontas, focando em resultados reais e sustentáveis.") }} />
              <ul className="check-list">
                <li>
                  <span className="ck">✓</span>
                  <div><strong>Plano de projeto personalizado</strong><br /><small className="muted">Entendendo seus objetivos, preferências e prazos antes de qualquer entrega.</small></div>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <div><strong>Acompanhamento com foco em resultado</strong><br /><small className="muted">Mais do que entregar arquivos, ajudo você a entender o impacto de cada decisão.</small></div>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <div><strong>Orientações claras e práticas</strong><br /><small className="muted">Instruções simples e aplicáveis ao dia a dia, sem jargão técnico desnecessário.</small></div>
                </li>
              </ul>
              <a href="#contact" className="btn-primary">Falar comigo →</a>
            </div>
          </div>
        </div>
      </section>

      <section id="services">
        <div className="container">
          <div className="services-header">
            <div>
              <div className="badge">Especialidades</div>
              <h2 className="section-title" style={{color: '#fff'}}>Como posso<br />te ajudar</h2>
            </div>
            <p className="section-sub" style={{textAlign: 'right', color: 'rgba(255,255,255,.5)'}}>Soluções sob medida para negócios que precisam crescer com consistência e identidade.</p>
          </div>
          <div className="services-grid">
            {categories.length > 0 ? (
              categories.map((cat, i) => (
                <div className="service-card reveal" key={cat._id || i} style={{transitionDelay: `${i * 0.1}s`}}>
                  <div className="service-icon">✦</div>
                  <h4>{cat.name}</h4>
                  <p>{cat.description || "Soluções especializadas com foco em alta performance e experiência do usuário."}</p>
                  <span className="service-tag">Freelancer Expert</span>
                </div>
              ))
            ) : (
              <>
                <div className="service-card reveal">
                  <div className="service-icon">🎨</div>
                  <h4>Design & Identidade Visual</h4>
                  <p>Logotipos, paletas, tipografia e sistemas visuais que comunicam quem você é antes mesmo de dizer uma palavra.</p>
                  <span className="service-tag">UI · Branding · Motion</span>
                </div>
                <div className="service-card reveal">
                  <div className="service-icon">💻</div>
                  <h4>Desenvolvimento Web</h4>
                  <p>Sites, landing pages e aplicações rápidas, responsivas e otimizadas para SEO que convertem visitantes em clientes.</p>
                  <span className="service-tag">React · Next.js · WordPress</span>
                </div>
                <div className="service-card reveal">
                  <div className="service-icon">📢</div>
                  <h4>Marketing Digital</h4>
                  <p>Estratégias de conteúdo, e-mail marketing e funis de vendas que mantêm sua marca relevante e geram receita previsível.</p>
                  <span className="service-tag">Estratégia · Conteúdo · Funil</span>
                </div>
                <div className="service-card reveal">
                  <div className="service-icon">📊</div>
                  <h4>Gestão de Tráfego Pago</h4>
                  <p>Campanhas no Meta Ads e Google Ads gerenciadas com método — cada real investido rastreado e otimizado para retorno real.</p>
                  <span className="service-tag">Meta Ads · Google Ads · ROAS</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <ProjectsSection
        title="Projetos"
        userId={userId}
        initialCategories={categories}
        initialProjects={projects}
      />

      <section id="process">
        <div className="container">
          <div className="badge">O Processo</div>
          <h2 className="section-title">Claro, prático <span className="olive">e humano</span></h2>
          <p className="section-sub" style={{margin: '12px auto 0', textAlign: 'center'}}>Cada etapa do projeto é pensada para simplificar sua rotina e transformar estratégia em ações concretas.</p>
          <div className="process-grid">
            {[
              { step: "01", icon: "🔍", title: "Consulta inicial", desc: "Mapeamento detalhado do seu negócio, objetivos e desafios antes de qualquer proposta." },
              { step: "02", icon: "🗺️", title: "Estratégia personalizada", desc: "Plano de ação focado nos seus resultados, respeitando prazo e orçamento disponível." },
              { step: "03", icon: "⚙️", title: "Entregas práticas", desc: "Execução etapa por etapa com atualizações frequentes e espaço para ajustes durante o processo." },
              { step: "04", icon: "🤝", title: "Acompanhamento contínuo", desc: "Suporte pós-entrega para garantir que você aproveite ao máximo cada solução desenvolvida." },
            ].map((s, i) => (
              <div className="process-step reveal" key={i} style={{transitionDelay: `${i * 0.1}s`}}>
                <div className="ps-num">{s.step}</div>
                <div className="ps-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="curriculum">
        <div className="container">
          <div className="reveal" style={{marginBottom: '44px'}}>
            <div className="badge" style={{background: 'rgba(255,255,255,.07)', borderColor: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.7)'}}>Trajetória</div>
            <h2 className="section-title" style={{color: '#fff'}}>Experiência &<br /><span style={{color: 'var(--olive3)'}}>Formação</span></h2>
          </div>
          <div className="cv-grid">
            <div className="cv-card reveal-l">
              <div className="cv-card-title">
                <span className="ico">📋</span>
                <span>Meu Currículo</span>
              </div>
              {about?.features && about.features.length > 0 ? (
                about.features.map((f, i) => (
                  <div className="cv-item" key={i}>
                    <span className="ck">✓</span>
                    <div><strong>{f.title}</strong>{f.description}</div>
                  </div>
                ))
              ) : (
                <>
                  <div className="cv-item"><span className="ck">✓</span><div><strong>Formação em Design & Tecnologia</strong>Foco em comunicação visual, tipografia e sistemas de identidade.</div></div>
                  <div className="cv-item"><span className="ck">✓</span><div><strong>Especialização em Marketing Digital</strong>Estratégia de conteúdo, SEO, mídia paga e analytics.</div></div>
                  <div className="cv-item"><span className="ck">✓</span><div><strong>Certificações Internacionais</strong>Sempre atualizado com as melhores práticas de mercado e ferramentas modernas.</div></div>
                  <div className="cv-item"><span className="ck">✓</span><div><strong>+100 projetos entregues</strong>Atuação em diversos nichos, de e-commerces a startups de tecnologia.</div></div>
                </>
              )}
            </div>
            <div className="cv-card reveal-r">
              <div className="cv-card-title">
                <span className="ico">⚙️</span>
                <span>Como Funciona Meu Atendimento</span>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px'}}>
                {[
                  { icon: "📅", title: "Briefing completo", desc: "Alinhamos tudo antes de começar para não perder tempo no meio do caminho." },
                  { icon: "🔄", title: "Revisões inclusas", desc: "Ciclos de feedback estruturados garantem que o resultado final seja o esperado.", accent: true },
                  { icon: "📡", title: "Relatórios reais", desc: "Dados de desempenho para que você acompanhe a evolução de perto." },
                  { icon: "🌐", title: "Atendimento online", desc: "Reuniões via Meet ou WhatsApp no horário que funciona para você." },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: item.accent ? 'var(--olive)' : 'var(--dark3)',
                    borderRadius: 'var(--r)',
                    padding: '14px 16px',
                    color: item.accent ? '#fff' : 'rgba(255,255,255,.85)'
                  }}>
                    <div style={{fontSize: '1rem', marginBottom: '6px'}}>{item.icon}</div>
                    <strong style={{fontSize: '.85rem', display: 'block', marginBottom: '4px'}}>{item.title}</strong>
                    <small style={{color: item.accent ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.4)', fontSize: '.77rem'}}>{item.desc}</small>
                  </div>
                ))}
              </div>
              <a href="#contact" className="btn-primary" style={{marginTop: '20px', width: '100%', justifyContent: 'center'}}>Agendar consulta</a>
            </div>
          </div>
        </div>
      </section>

      <section id="howitworks">
        <div className="container">
          <div className="hiw-grid">
            <div className="reveal-l">
              <div className="badge">Diferenciais</div>
              <h2 className="section-title">Dê o primeiro passo para um projeto <em style={{color: 'var(--olive)'}}>mais equilibrado</em></h2>
              <p className="section-sub">Transforme sua presença digital com escolhas conscientes e um acompanhamento que realmente faz sentido para o seu negócio.</p>
              <a href="#contact" className="btn-primary" style={{marginTop: '28px'}}>Agendar consulta agora →</a>
            </div>
            <div className="hiw-cards reveal-r">
              {[
                { icon: "🎯", title: "Foco no seu objetivo", desc: "Cada decisão é tomada com base nos resultados que você quer alcançar." },
                { icon: "⚡", title: "Entrega ágil", desc: "Prazos respeitados e processos enxutos para que você saia do papel rápido." },
                { icon: "🔒", title: "Transparência total", desc: "Contrato claro, escopo definido e comunicação direta em todas as etapas." },
                { icon: "📈", title: "Métricas que importam", desc: "Relatórios focados em dados que geram decisão, não só em números bonitos." },
              ].map((card, i) => (
                <div className="hiw-card" key={i}>
                  <div className="ico">{card.icon}</div>
                  <h5>{card.title}</h5>
                  <p>{card.desc}</p>
                </div>
              ))}
              <div className="hiw-card accent">
                <div className="ico">🤝</div>
                <div>
                  <h5>Parceria de longo prazo</h5>
                  <p>Mais do que um fornecedor, sou um parceiro estratégico comprometido com o seu crescimento contínuo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta-banner">
        <div className="container">
          <div className="cta-inner reveal">
            <div>
              <h2>Dê o primeiro passo para uma presença digital mais equilibrada</h2>
              <p>Transforme seu negócio com escolhas conscientes e um acompanhamento que realmente traz resultado para a sua rotina.</p>
            </div>
            <a href="#contact" className="btn-white">Agendar consulta agora →</a>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info reveal-l">
              <div className="badge">Entre em contato</div>
              <h2 className="section-title">Vamos conversar<br />sobre o seu <span className="olive">projeto</span></h2>
              <p className="section-sub">Respondo em até 24 horas. Escolha o canal que preferir para iniciarmos nossa conversa.</p>
              <div className="contact-items" style={{marginTop: '28px'}}>
                {[
                  { icon: "📞", text: "(00) 00000-0000", sub: "WhatsApp disponível" },
                  { icon: "✉️", text: "contato@freelancer.com", sub: "Resposta em até 24h" },
                  { icon: "📍", text: "Atendimento online e presencial", sub: "Global / Remoto" },
                ].map((item, i) => (
                  <div className="contact-item" key={i}>
                    <div className="contact-icon">{item.icon}</div>
                    <div>
                      <span>{item.text}</span>
                      <small>{item.sub}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-r">
              <div className="chat-mock">
                <div className="chat-header">
                  <div className="chat-avatar">
                    <UserAvatar user={{ name: fullName, image: hero?.backgroundImage }} size="sm" />
                  </div>
                  <div>
                    <div className="chat-hname">{fullName}</div>
                    <div className="chat-hstatus">Online agora</div>
                  </div>
                </div>
                <div className="chat-msgs">
                  <div className="msg in">Olá! Estou precisando de ajuda com meu site e redes sociais. Você atende esse tipo de projeto?<div className="msg-time">14:22</div></div>
                  <div className="msg out">Olá! Com certeza. Posso te ajudar tanto com o desenvolvimento do site quanto com a estratégia de marketing digital. Qual é o seu maior desafio hoje?<div className="msg-time">14:23</div></div>
                  <div className="msg in">Tenho um e-commerce mas não estou conseguindo converter os visitantes em compradores.<div className="msg-time">14:25</div></div>
                  <div className="msg out">Entendido! Esse é um problema de CRO + tráfego qualificado. Posso fazer uma auditoria gratuita para identificar os pontos de melhoria. Quando você tem 30 min? 🚀<div className="msg-time">14:26</div></div>
                </div>
                <div className="chat-input">
                  <span>Digite sua mensagem...</span>
                  <div className="send-btn">➤</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <p>Formando parcerias digitais estratégicas com método, prática e resultado real desde que iniciei minha jornada.</p>
            </div>
            <div className="footer-links">
              <h5>Navegação</h5>
              <a href="#about">Sobre</a>
              <a href="#services">Serviços</a>
              <a href="#process">Processo</a>
              <a href="#curriculum">Experiência</a>
            </div>
            <div className="footer-links">
              <h5>Contato</h5>
              <a href="#">WhatsApp</a>
              <a href="#">E-mail</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </div>
            <div className="footer-links">
              <h5>Legal</h5>
              <a href="#">Política de privacidade</a>
              <a href="#">Termos de uso</a>
              <a href="#">Portfólio</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {fullName}. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
