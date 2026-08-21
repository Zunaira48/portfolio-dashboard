"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#education", label: "Education" },
  { href: "/#certifications", label: "Certifications" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-sm text-text-muted hover:text-text transition-colors">
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-sm">
      {label}
    </Link>
  );
}

export default function Nav({ brandName = "Zunaira" }: { brandName?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg tracking-tight">
          {brandName}
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="lg:hidden border-t border-border px-6 py-4 flex flex-col gap-4">
          {LINKS.map((link) => (
            <MobileNavLink key={link.href} href={link.href} label={link.label} onClick={() => setOpen(false)} />
          ))}
        </nav>
      ) : null}
    </header>
  );
}
