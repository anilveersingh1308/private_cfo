import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

export interface UserPayload {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Edge Runtime compatible JWT functions
export async function generateTokenEdge(user: UserPayload): Promise<string> {
  return await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
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
      typeof payload.name === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string'
    ) {
      return {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
