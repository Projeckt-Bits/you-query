import { NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import { app } from '../../../../../firebase';

/**
 * GET /api/auth/verify
 * Verifies the current user's authentication status
 * 
 * Headers:
 * Authorization: Bearer <idToken>
 */
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    const auth = getAuth(app);

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    return NextResponse.json(
      {
        success: true,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token verification error:', error);

    return NextResponse.json(
      { error: 'Invalid or expired token', code: error.code },
      { status: 401 }
    );
  }
}
