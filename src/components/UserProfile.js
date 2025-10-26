'use client';

import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="font-medium text-gray-800">{user.displayName || 'User'}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      {user.photoURL ? (
        <Image
          src={user.photoURL}
          alt={user.displayName || 'User'}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-lg">
            {user.email ? user.email[0].toUpperCase() : 'U'}
          </span>
        </div>
      )}
      <button
        onClick={logout}
        className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
