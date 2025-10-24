import { NextResponse } from 'next/server';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../../../../firebase';

/**
 * POST /api/auth/logout
 * Signs out the current user
 */
export async function POST(request) {
  try {
    const auth = getAuth(app);
    await signOut(auth);

    return NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);

    return NextResponse.json(
      { error: 'An error occurred during logout', code: error.code },
      { status: 500 }
    );
  }
}
