"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../../firebase";
import { ref as dbRef, get } from "firebase/database";

export default function Header({ onToggleSidebar }) {
  const { user } = useAuth();
  const [greetingName, setGreetingName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const loadName = async () => {
      try {
        if (!user) return;
        const snap = await get(dbRef(database, `portfolios/${user.uid}/profile`));
        const data = snap.exists() ? snap.val() : {};
        const dbName = data?.name || "";
        const dbAvatar = data?.avatarUrl || "";
        const fallback = user.displayName || user.email?.split("@")[0] || "there";
        if (active) {
          setGreetingName(dbName || fallback);
          setAvatarUrl(dbAvatar || user.photoURL || user.providerData?.[0]?.photoURL || "");
        }
      } catch (e) {
        const fallback = user?.displayName || user?.email?.split("@")[0] || "there";
        if (active) {
          setGreetingName(fallback);
          setAvatarUrl(user?.photoURL || user?.providerData?.[0]?.photoURL || "");
        }
      }
    };
    loadName();
    return () => { active = false; };
  }, [user]);

  return (
    <header
      className="fixed top-0 inset-x-0 z-40 border-b border-white/10 text-white shadow-sm bg-[--color-deep-blue]"
      style={{ backgroundImage: "linear-gradient(90deg, var(--color-deep-blue), var(--color-electric-blue))" }}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={onToggleSidebar}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 text-white hover:bg-white/10 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <span className="font-semibold tracking-tight text-white">YouQuery</span>
        </div>
        <nav aria-label="Header actions" className="flex items-center gap-3">
          {greetingName ? (
            <span className="hidden sm:inline text-sm/6 text-white/90">Hey, <strong className="font-semibold text-white">{greetingName}</strong></span>
          ) : null}
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full"
            title="View profile"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-white/30 hover:ring-2 hover:ring-white/60 transition"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="grid place-items-center w-8 h-8 rounded-full bg-white/20 text-white text-xs font-semibold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Dialog */}
      <div
        className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        {/* Panel */}
        <div className={`absolute right-4 top-16 w-80 bg-white text-[--color-foreground] rounded-lg shadow-lg border border-[--border] transition-transform ${open ? 'translate-y-0' : '-translate-y-2 opacity-0'}`} role="dialog" aria-modal="true" aria-label="User info">
          <div className="p-4 flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-[--border]" />
            ) : (
              <span className="grid place-items-center w-10 h-10 rounded-full bg-[--color-primary-500] text-white text-sm font-semibold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
            <div className="min-w-0">
              <div className="font-bold text-black truncate">{greetingName || 'User'}</div>
              <div className="text-sm text-black truncate">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
