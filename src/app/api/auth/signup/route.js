import { NextResponse } from 'next/server';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../../../../firebase';

/**
 * POST /api/auth/signup
 * Creates a new user account with email and password
 * 
 * Request body:
 * {
 *   email: string,
 *   password: string,
 *   name?: string
 * }
 */
export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create user with Firebase Auth
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Return user data (excluding sensitive information)
    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          createdAt: user.metadata.creationTime,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);

    // Handle Firebase-specific errors
    let errorMessage = 'An error occurred during signup';
    let statusCode = 500;

    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already in use';
      statusCode = 409;
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
      statusCode = 400;
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
      statusCode = 400;
    }

    return NextResponse.json(
      { error: errorMessage, code: error.code },
      { status: statusCode }
    );
  }
}
