"use client";

import React from "react";
import Image from "next/image";
import { LOGO_DARK, LOGO_LIGHT } from "@/constants/assets";

export function FooterB({ dark }: { dark?: boolean }) {
  return (
    <footer className={`py-20 px-4 border-t ${dark ? "bg-[#17181E] border-white/5 text-white" : "bg-[#F8F9FA] border-black/5 text-slate-900"}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 space-y-6">
          <Image
            src={dark ? LOGO_DARK : LOGO_LIGHT}
            alt="Portify"
            width={120}
            height={26}
            style={{ height: 26, width: 'auto', objectFit: "contain" }}
          />
          <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
            A plataforma definitiva para criativos que querem transformar seu trabalho em um negócio lucrativo.
          </p>
        </div >

        <div>
          <h4 className="font-bold mb-6">Produto</h4>
          <ul className={`space-y-4 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Templates</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Preços</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Recursos</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Suporte</h4>
          <ul className={`space-y-4 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Documentação</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Central de Ajuda</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Contato</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">API</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Legal</h4>
          <ul className={`space-y-4 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Termos de Uso</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Privacidade</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Cookies</a></li>
          </ul>
        </div>
      </div >

      <div className={`mt-20 pt-8 border-t ${dark ? "border-white/5" : "border-slate-200"} flex flex-col md:flex-row justify-between items-center gap-4 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
        <p>© 2025 Portify. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-500">Twitter</a>
          <a href="#" className="hover:text-blue-500">Instagram</a>
          <a href="#" className="hover:text-blue-500">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
