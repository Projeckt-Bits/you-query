'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../../firebase';
import { ref as dbRef, get, update, set } from 'firebase/database';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [dob, setDob] = useState('');
  const [college, setCollege] = useState('');
  const [city, setCity] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  const fallbackAvatar = useMemo(
    () => user?.photoURL || user?.providerData?.[0]?.photoURL || '',
    [user]
  );

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load profile from Realtime DB
    const loadProfile = async () => {
      try {
        const snap = await get(dbRef(database, `portfolios/${user.uid}/profile`));
        if (snap.exists()) {
          const data = snap.val();
          setName(data.name || '');
          setBio(data.bio || '');
          setAvatarUrl(data.avatarUrl || fallbackAvatar || '');
          setDob(data.dob || '');
          setCollege(data.college || '');
          setCity(data.city || '');
        } else {
          setAvatarUrl(fallbackAvatar || '');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setToast({ type: 'error', message: 'Failed to load profile' });
      }
    };
    loadProfile();
  }, [user, router, fallbackAvatar]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const uploadToCloudinary = async () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary env vars missing');
    }
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Upload failed: ${t}`);
    }
    const json = await res.json();
    return json.secure_url;
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setToast({ type: '', message: '' });
    try {
      let finalAvatar = avatarUrl;
      if (file) {
        finalAvatar = await uploadToCloudinary();
      }
      const payload = {
        name: name || '',
        bio: bio || '',
        avatarUrl: finalAvatar || '',
        email: user.email || '',
        dob: dob || '',
        college: college || '',
        city: city || '',
        updatedAt: Date.now(),
      };
      await set(dbRef(database, `portfolios/${user.uid}/profile`), payload);
      setAvatarUrl(finalAvatar);
      setFile(null);
      setPreviewUrl('');
      setToast({ type: 'success', message: 'Profile updated successfully' });
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to update profile' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ type: '', message: '' }), 2500);
    }
  };

  if (!user) return <div>Loading...</div>;

  const displayAvatar = previewUrl || avatarUrl || fallbackAvatar;

  return (
    <div className="max-w-4xl">
      {/* Toast */}
      {toast.message ? (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-md shadow-md text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      ) : null}

      <form onSubmit={onSave} className="card overflow-hidden">
        <div className="px-6 py-4 bg-[--color-primary-900] text-white flex items-center justify-between">
          <h1 className="text-lg font-semibold">Edit Profile</h1>
          <span className="text-xs/5 opacity-80">{user.email}</span>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover border border-[--border]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[--color-primary-500] text-white font-bold grid place-items-center text-lg">
                {user.email?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div>
              <label className="block text-sm mb-1">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block text-sm"
              />
              <p className="text-xs text-[--muted] mt-1">Live preview shown. Image uploads to Cloudinary on save.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1" htmlFor="name">Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[--border] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-focus]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[--border] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-focus]"
              />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="college">College</label>
              <input
                id="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[--border] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-focus]"
                placeholder="Your college"
              />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="city">Current City</label>
              <input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[--border] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-focus]"
                placeholder="City"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-[--border] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-focus]"
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md text-white bg-[#3B82F6] hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => { setFile(null); setPreviewUrl(''); }}
              className="px-4 py-2 rounded-md border border-[--border] hover:bg-[--color-surface-muted]"
            >
              Reset Preview
            </button>
          </div>
          <div className="mt-2 text-sm text-[--muted]">
            <div>Last login: {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : '—'}</div>
          </div>
        </div>
      </form>
    </div>
  );
}
