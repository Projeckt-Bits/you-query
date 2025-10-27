"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Sidebar({ open, onClose }) {
  const panelRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") ?? "chat").toLowerCase();

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
        <nav className="h-full overflow-y-auto p-3 space-y-1" aria-label="Sidebar">
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
      </aside>
    </>
  );
}
