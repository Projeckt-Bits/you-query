import { NextResponse } from 'next/server';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../../../../firebase';

/**
 * POST /api/auth/login
 * Authenticates a user with email and password
 * 
 * Request body:
 * {
 *   email: string,
 *   password: string
 * }
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in user with Firebase Auth
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get ID token for the user
    const idToken = await user.getIdToken();

    // Return user data and token
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
        },
        token: idToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);

    // Handle Firebase-specific errors
    let errorMessage = 'An error occurred during login';
    let statusCode = 500;

    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid email or password';
      statusCode = 401;
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
      statusCode = 400;
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled';
      statusCode = 403;
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed login attempts. Please try again later';
      statusCode = 429;
    }

    return NextResponse.json(
      { error: errorMessage, code: error.code },
      { status: statusCode }
    );
  }
}
