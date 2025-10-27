'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import ChatBox from '../../components/ChatBox';
import PortfolioForm from '../../components/portfolio/PortfolioForm';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSection = (searchParams.get('tab') ?? 'chat').toLowerCase();
  const avatarUrl = user?.photoURL || user?.providerData?.[0]?.photoURL || null;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {activeSection === 'chat' ? (
        <div className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)]">
          <ChatBox />
        </div>
      ) : (
        <PortfolioForm />
      )}
    </div>
  );
}
