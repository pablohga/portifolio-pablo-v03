"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8" }: LogoProps) {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="https://mundonews.pt/portify_logo_new_p.png"
        alt="Portify"
        width={32}
        height={32}
        className={className}
      />
    </Link>
  );
}