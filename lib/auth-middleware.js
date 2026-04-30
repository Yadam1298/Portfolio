// lib/auth-middleware.js
import { verifyToken } from './auth';

export async function verifyAuth(req) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      console.log('No authorization header');
      return null;
    }

    // Extract the token (format: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    if (!token) {
      console.log('No token found in authorization header');
      return null;
    }

    // Verify the token
    const decoded = verifyToken(token);
    console.log('Token verified successfully for:', decoded.email);

    return decoded;
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return null;
  }
}
