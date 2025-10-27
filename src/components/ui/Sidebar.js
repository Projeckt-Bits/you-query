"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ open, onClose }) {
  const panelRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") ?? "chat").toLowerCase();
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && open) onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!open}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        ref={panelRef}
        className={`fixed z-40 top-14 left-0 h-[calc(100vh-3.5rem)] w-64 border-r bg-[--surface] text-[--foreground] shadow-sm transition-transform duration-200 [transition-timing-function:var(--easing)]
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        aria-label="Primary"
      >
        <nav className="h-full overflow-y-auto p-3 space-y-1 pb-20" aria-label="Sidebar">
          <Link href="/dashboard?tab=chat" className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${pathname.startsWith('/dashboard') && tab === 'chat' ? 'bg-[--color-light-blue] text-[--color-primary-900]' : 'hover:bg-[--color-surface-muted]'}`}>
            <span className="inline-block h-2 w-2 rounded-full bg-[--color-primary-500]"></span>
            <span className="text-sm">Chat</span>
          </Link>
          <Link href="/dashboard?tab=portfolio" className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${pathname.startsWith('/dashboard') && tab === 'portfolio' ? 'bg-[--color-light-blue] text-[--color-primary-900]' : 'hover:bg-[--color-surface-muted]'}`}>
            <span className="inline-block h-2 w-2 rounded-full bg-[--color-info]"></span>
            <span className="text-sm">Portfolio</span>
          </Link>
          <a href="/profile" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-[--color-surface-muted] transition-colors">
            <span className="inline-block h-2 w-2 rounded-full bg-[--color-info]"></span>
            <span className="text-sm">Profile</span>
          </a>
        </nav>
        {/* Bottom action */}
        <div className="absolute bottom-0 inset-x-0 p-3 border-t bg-[--surface]">
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-white bg-[#3B82F6] hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-focus] text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          ) : (
            <button onClick={() => router.push('/login?notice=fill')} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-white bg-[#3B82F6] hover:bg-[#2563EB] text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Sign in
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
