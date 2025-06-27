import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const publicPaths = ['/', '/login'];
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.includes(path)) {
    if (token) {
      // If user is already logged in, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check for protected routes
  if (!token && path.startsWith('/dashboard')) {
    // Redirect to login if no token is present
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
