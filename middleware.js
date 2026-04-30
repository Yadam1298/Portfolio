import { NextResponse } from 'next/server';

export function middleware(request) {
  // For middleware, we can only check cookies, not sessionStorage
  const token = request.cookies.get('admin_token')?.value;

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPath = request.nextUrl.pathname === '/login';

  console.log(
    'Middleware - Path:',
    request.nextUrl.pathname,
    'Token exists:',
    !!token,
  );

  // If trying to access admin without token, redirect to login
  if (isAdminPath && !token) {
    console.log('No token, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has token and trying to access login, redirect to admin
  if (isLoginPath && token) {
    console.log('Has token, redirecting to admin');
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
