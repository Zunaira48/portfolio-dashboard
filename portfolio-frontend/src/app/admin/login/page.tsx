"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { adminApi, ApiError } from "@/lib/adminApi";
import { ShieldAlert } from "lucide-react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

// Minimal shape of the Google Identity Services global we actually use.
interface GoogleAccountsId {
  initialize: (config: { client_id: string; callback: (resp: { credential: string }) => void }) => void;
  renderButton: (parent: HTMLElement, options: { theme: string; size: string; width: number }) => void;
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function handleCredential(response: { credential: string }) {
    setVerifying(true);
    setError("");
    try {
      await adminApi.verify(response.credential);
      router.push("/admin");
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError("This Google account is not authorized as the site administrator.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
      setVerifying(false);
    }
  }

  useEffect(() => {
    if (!scriptLoaded || !window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 280,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded]);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" onLoad={() => setScriptLoaded(true)} strategy="afterInteractive" />

      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={22} className="text-accent" />
          </div>

          <h1 className="font-display text-xl font-bold mb-2">Admin Access</h1>
          <p className="text-text-muted text-sm mb-6">Sign in with the authorized Google account to manage this portfolio.</p>

          {!GOOGLE_CLIENT_ID ? (
            <p className="text-red-500 text-sm">
              Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local
            </p>
          ) : (
            <div className="flex justify-center">
              <div ref={buttonRef} />
            </div>
          )}

          {verifying ? <p className="text-text-muted text-sm mt-4">Verifying...</p> : null}
          {error ? <p className="text-red-500 text-sm mt-4">{error}</p> : null}
        </div>
      </div>
    </>
  );
}
