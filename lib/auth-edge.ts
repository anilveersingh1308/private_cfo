import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

export interface UserPayload {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

// Edge Runtime compatible JWT functions
export async function generateTokenEdge(user: UserPayload): Promise<string> {
  return await new SignJWT({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyTokenEdge(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    
    // Validate that the payload has the required properties
    if (
      typeof payload.id === 'number' &&
      typeof payload.username === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string'
    ) {
      return {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        role: payload.role,
        first_name: payload.first_name as string | undefined,
        last_name: payload.last_name as string | undefined,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
