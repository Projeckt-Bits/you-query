'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      console.log('Sending password reset email to:', email);
      
      // Add action code settings to specify the URL to redirect after password reset
      const actionCodeSettings = {
        url: `${window.location.origin}/login`, // Where to redirect after password reset
        handleCodeInApp: false, // Set to true if you want to handle the password reset in your app
      };
      
      await sendPasswordResetEmail(auth, email, actionCodeSettings)
        .then(() => {
          console.log('Password reset email sent successfully');
          setMessage('Password reset email sent! Please check your inbox (and spam folder).');
          setEmail('');
        })
        .catch((error) => {
          console.error('Firebase error details:', {
            code: error.code,
            message: error.message,
            email: email,
            timestamp: new Date().toISOString()
          });
          
          // More specific error messages
          if (error.code === 'auth/user-not-found') {
            setError('No account found with this email address.');
          } else if (error.code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
          } else if (error.code === 'auth/too-many-requests') {
            setError('Too many attempts. Please try again later.');
          } else {
            setError(`Failed to send password reset email: ${error.message}`);
          }
        });
    } catch (error) {
      console.error('Unexpected error:', {
        error: error,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {message && (
            <div className="text-green-600 text-sm text-center p-2 bg-green-50 rounded-md">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <Link 
            href="/login" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
