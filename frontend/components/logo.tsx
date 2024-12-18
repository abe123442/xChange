"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  return (
    <Image
      alt="Logo"
      className="hidden md:block cursor-pointer"
      height={40}
      width={40}
      src="/images/logo.png"
    />
  );
};

export default Logo;
