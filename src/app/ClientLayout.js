'use client';

import { useEffect } from 'react';
import { AuthProvider } from "../context/AuthContext";

export default function ClientLayout({ children }) {
  // This effect will only run on the client side
  useEffect(() => {
    console.log('ClientLayout mounted on client side');
  }, []);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
