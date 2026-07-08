import Image from "next/image";

export default function Loading() {
  return (
    <>
      <div className="loading-root" aria-label="Carregando…" role="status">
        {/* Logo — dark mode (fundo escuro) */}
        <div className="logo-wrapper logo-dark">
          <Image
            src="/images/logo_nova_txt_g_dark.png"
            alt="Portify"
            width={180}
            height={52}
            priority
            className="logo-img"
          />
        </div>

        {/* Logo — light mode (fundo claro) */}
        <div className="logo-wrapper logo-light">
          <Image
            src="/images/logo_nova_txt_g_ligth.png"
            alt="Portify"
            width={180}
            height={52}
            priority
            className="logo-img"
          />
        </div>

        {/* Barra de progresso animada */}
        <div className="progress-track" aria-hidden="true">
          <div className="progress-bar" />
        </div>
      </div>

      <style>{`
        /* ── Raiz ───────────────────────────────────────────── */
        .loading-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
          min-height: 100dvh;
          width: 100%;
          background-color: var(--background, #0d0d0d);
        }

        /* ── Logo ───────────────────────────────────────────── */
        .logo-wrapper {
          animation: logoIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          opacity: 0;
        }

        .logo-img {
          display: block;
          width: 180px;
          height: auto;
          object-fit: contain;
          animation: logoPulse 2.6s ease-in-out 0.5s infinite;
        }

        /* Alternância dark / light via prefers-color-scheme */
        .logo-dark  { display: block; }
        .logo-light { display: none;  }

        @media (prefers-color-scheme: light) {
          .loading-root {
            background-color: var(--background, #f5f5f5);
          }
          .logo-dark  { display: none;  }
          .logo-light { display: block; }
        }

        /* Alternância via classe .dark / .light na raiz (next-themes) */
        :global(html.dark) .loading-root {
          background-color: var(--background, #0d0d0d);
        }
        :global(html.dark) .logo-dark  { display: block; }
        :global(html.dark) .logo-light { display: none;  }

        :global(html.light) .loading-root {
          background-color: var(--background, #f5f5f5);
        }
        :global(html.light) .logo-dark  { display: none;  }
        :global(html.light) .logo-light { display: block; }

        /* ── Progress bar ───────────────────────────────────── */
        .progress-track {
          width: 180px;
          height: 3px;
          border-radius: 999px;
          background-color: rgba(0, 210, 230, 0.15);
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          width: 45%;
          border-radius: 999px;
          background: linear-gradient(90deg, #00c8e0, #40e0ff);
          animation: progressSlide 1.6s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(0, 210, 230, 0.6);
        }

        /* ── Keyframes ──────────────────────────────────────── */
        @keyframes logoIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes logoPulse {
          0%, 100% {
            filter: drop-shadow(0 0 0px rgba(0, 210, 230, 0));
            opacity: 1;
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(0, 210, 230, 0.4));
            opacity: 0.88;
          }
        }

        @keyframes progressSlide {
          0%   { transform: translateX(-120%); }
          60%  { transform: translateX(260%);  }
          100% { transform: translateX(260%);  }
        }

        /* ── Acessibilidade ─────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .logo-wrapper,
          .logo-img,
          .progress-bar {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
