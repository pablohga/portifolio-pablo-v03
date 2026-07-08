"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  alterIcon?: string;
  alterH?: number;
  alterW?: number;
}

export function Logo({ className = "h-8", alterIcon, alterH, alterW }: LogoProps) {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src={alterIcon ? alterIcon : "/images/nova_logo_icon.png"}
        alt="Portify"
        width={alterW ? alterW : 25}
        height={alterH ? alterH : 32}
        className={className}
      />
    </Link>
  );
}