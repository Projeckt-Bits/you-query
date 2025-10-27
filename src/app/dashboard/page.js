'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import ChatInterface from '../../components/ChatInterface';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      alert('Successfully logged out');
      router.push('/login');
    } catch (error) {
      alert('Failed to log out: ' + error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">YouQuery Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-700">
                Welcome, {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Profile Info Section */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Account Created:</span> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Login:</span> {new Date(user.metadata.lastSignInTime).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface Section */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Chat with Your AI</h2>
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}