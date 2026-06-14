import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Protect /secure routes
  if (url.pathname.startsWith('/secure')) {
    const isLoginPage = url.pathname === '/secure/admin/login' || url.pathname === '/secure/superadmin/login'
    
    // If not logged in and not on a login page, redirect to admin login
    if (!user && !isLoginPage) {
      url.pathname = '/secure/admin/login'
      return NextResponse.redirect(url)
    }

    // If logged in and on a login page, redirect to dashboard
    if (user && isLoginPage) {
      if (url.pathname === '/secure/superadmin/login') {
        url.pathname = '/secure/superadmin/dashboard'
      } else {
        url.pathname = '/secure/admin/dashboard'
      }
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
