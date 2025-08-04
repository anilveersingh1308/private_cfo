import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth-edge';

export async function middleware(request: NextRequest) {
  // Check if it's a protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // Check if it's the sign-in page
  const isSignInPage = request.nextUrl.pathname.startsWith('/sign-in');

  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const user = await verifyTokenEdge(token);
    
    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // For dashboard routes, allow any authenticated user
    // (You can add specific role checks for specific dashboard paths if needed)
    // if (request.nextUrl.pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/sign-in', request.url));
    // }
  }

  // If user is authenticated and tries to access sign-in page, redirect to dashboard
  if (isSignInPage) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (token) {
      const user = await verifyTokenEdge(token);
      
      if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in/:path*']
};
