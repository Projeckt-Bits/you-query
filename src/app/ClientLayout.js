'use client';

import { useEffect, useState, useCallback } from 'react';
import { AuthProvider } from "../context/AuthContext";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";

export default function ClientLayout({ children }) {
  // This effect will only run on the client side
  useEffect(() => {
    console.log('ClientLayout mounted on client side');
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[--color-background] text-[--color-foreground]">
        {/* Skip link for keyboard users */}
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-white text-[--color-foreground] px-3 py-1.5 rounded-md border border-[--border] shadow-sm">Skip to content</a>
        <Header onToggleSidebar={toggleSidebar} />
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />

        {/* App shell */}
        <div className="pt-14 md:pl-64">
          <main id="main" className="min-h-[calc(100vh-3.5rem)]" role="main">
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
