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
        src="https://mundonews.pt/portify/nova_logo_icon.png"
        alt="Portify"
        width={25}
        height={32}
        className={className}
      />
      {/* <Image
        src="https://mundonews.pt/portify_logo_p-2.png"
        alt="Portify"
        width={32}
        height={32}
        className={className}
      /> */}
      {/* <Image
        src="https://mundonews.pt/portify_logo_new_p.png"
        alt="Portify"
        width={32}
        height={32}
        className={className}
      /> */}
    </Link>
  );
}