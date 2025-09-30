"use client"

import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const path = usePathname();
  if (path.includes("/dashboard")) {
    return null;
  }
  return (
    <footer className="relative z-10 border-t py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-muted-foreground">
          Made with ❤️ by{" "}
          <span className="text-white/85 font-semibold">
            WhizzDigics
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
