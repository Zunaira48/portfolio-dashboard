"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isLoginPage) return; // login page handles its own flow, no guard needed there

    adminApi
      .me()
      .then((session) => {
        setEmail(session.email);
        setStatus("authorized");
      })
      .catch(() => {
        setStatus("unauthorized");
        router.replace("/admin/login");
      });
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  if (status === "unauthorized") {
    return null; // redirect already triggered
  }

  return (
    <div className="flex">
      <AdminSidebar email={email} />
      <main className="flex-1 min-w-0 p-6 lg:p-10">{children}</main>
    </div>
  );
}
