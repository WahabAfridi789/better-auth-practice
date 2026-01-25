import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/todos/*',
  '/settings/*',
  '/organizations/*'
];

// Routes that should redirect to dashboard if already authenticated (except 2FA page)
const authRoutes = ['/auth'];

// Routes that should NOT redirect even if authenticated (2FA verification, invitation acceptance)
const authExceptions = ['/auth/two-factor', '/accept-invitation'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  console.log('isProtectedRoute', isProtectedRoute);

  // Check if it's an auth route (login/signup) but not an exception
  const isAuthException = authExceptions.some((route) =>
    pathname.startsWith(route)
  );
  console.log('isAuthException', isAuthException);
  const isAuthRoute =
    authRoutes.some((route) => pathname.startsWith(route)) && !isAuthException;

  // Get session by calling your backend (must forward cookies!)
  const session = request.cookies.has('better-auth.session_token');
  console.log('session', session);

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !session) {
    const url = new URL('/auth/sign-in', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth routes (except 2FA page)
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard/overview', request.url));
  }

  console.log('returning next response');

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/settings',
    '/organizations/:path*',
    '/organizations',
    '/auth/:path*',
    '/auth',
    '/accept-invitation/:path*'
  ]
};
