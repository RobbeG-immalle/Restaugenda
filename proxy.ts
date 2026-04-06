import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  // Step 1: Handle i18n routing (locale detection, redirects, rewrites)
  const response = intlMiddleware(request)

  // Step 2: Handle Supabase session (cookie refresh)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Step 3: Protect routes (locale-aware)
  const pathname = request.nextUrl.pathname
  const localePattern = routing.locales.join('|')
  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/(${localePattern})`), '') || '/'

  const isPublicPath =
    pathWithoutLocale === '/' ||
    pathWithoutLocale.startsWith('/login') ||
    pathWithoutLocale.startsWith('/signup') ||
    pathWithoutLocale.startsWith('/pricing')

  if (!user && !isPublicPath) {
    const localeMatch = pathname.match(new RegExp(`^/(${localePattern})`))
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
