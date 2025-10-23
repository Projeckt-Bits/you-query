import { getAuth } from 'firebase/auth';
import { app } from '../../firebase';

/**
 * Verify Firebase ID token
 * @param {string} idToken - The Firebase ID token to verify
 * @returns {Promise<Object>} Decoded token with user information
 */
export async function verifyIdToken(idToken) {
  try {
    const auth = getAuth(app);
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract token from Authorization header
 * @param {Request} request - The incoming request
 * @returns {string|null} The extracted token or null
 */
export function extractToken(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split('Bearer ')[1];
}

/**
 * Middleware to protect API routes
 * @param {Request} request - The incoming request
 * @returns {Promise<Object>} User data if authenticated
 * @throws {Error} If authentication fails
 */
export async function requireAuth(request) {
  const token = extractToken(request);
  
  if (!token) {
    throw new Error('No authorization token provided');
  }
  
  try {
    const decodedToken = await verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
