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

// Helper function to verify auth from request
export async function verifyAuth(request: Request): Promise<{ success: boolean; user?: UserPayload }> {
  try {
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    
    // If no auth header, try to get from cookies
    if (!token) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split('; ').map(c => {
            const [key, ...v] = c.split('=');
            return [key, decodeURIComponent(v.join('='))];
          })
        );
        token = cookies.auth_token;
      }
    }
    
    if (!token) {
      return { success: false };
    }
    
    const user = await verifyTokenEdge(token);
    if (!user) {
      return { success: false };
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('Auth verification failed:', error);
    return { success: false };
  }
}
