"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Sparkles,
  Briefcase,
  GraduationCap,
  Newspaper,
  Award,
  Mail,
  Image as ImageIcon,
  Share2,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/social-links", label: "Social Links", icon: Share2 },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={
              active
                ? "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-accent-soft text-accent"
                : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-bg-soft transition-colors"
            }
          >
            <Icon size={17} />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function AdminSidebar({ email }: { email: string }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await adminApi.logout();
    router.push("/admin/login");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border h-screen sticky top-0 p-4">
        <div className="px-2 py-3 mb-2">
          <p className="font-display font-bold">Admin</p>
          <p className="text-xs text-text-muted truncate">{email}</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <NavLinks />
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors mt-2"
        >
          <LogOut size={17} /> Logout
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-border sticky top-0 z-40 bg-bg">
        <p className="font-display font-bold">Admin</p>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {mobileOpen ? (
        <div className="lg:hidden fixed inset-0 z-50 bg-bg p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-bold">Admin</p>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <p className="text-xs text-text-muted mb-4 px-2">{email}</p>
          <nav className="flex flex-col gap-1">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 mt-4"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      ) : null}
    </>
  );
}
