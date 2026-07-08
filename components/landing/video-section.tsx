"use client";

import { Reveal } from "@/components/ui/reveal";
import { PlayCircle } from "lucide-react";

export function VideoSection({ dark }: { dark: boolean }) {
  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-[#1E1F25]" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <h2 className={`font-poppins text-3xl md:text-5xl font-bold mb-6 ${dark ? "text-white" : "text-slate-900"}`}>
            Veja a mágica acontecer
          </h2>
          <p className={`font-inter text-lg mb-12 ${dark ? "text-slate-400" : "text-slate-600"}`}>
            Descubra como transformar sua presença digital em segundos com nossa demonstração completa.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className={`relative aspect-video rounded-3xl overflow-hidden border-4 shadow-2xl transition-all duration-500 group ${
            dark ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-slate-50"
          }`}>
            {/* Video Embed Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:scale-110 ${
                dark ? "bg-[#A6E7FF] text-slate-900" : "bg-blue-600 text-white"
              } shadow-xl shadow-primary/20`}>
                <PlayCircle className="w-10 h-10" />
              </div>
            </div>
            <iframe
              className="w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Example
              title="Product Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
