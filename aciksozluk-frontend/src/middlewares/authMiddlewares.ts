import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import config from '@/config'
import { getCookie } from '@/lib/serverActions'
import { runMiddlewareIfPathMatches } from '@/lib/utils'

const membersOnly = config.membersOnly

export function redirectAuthenticatedBackTo(redirectTo: string) {
  return runMiddlewareIfPathMatches(/^\/auth\//)(async function (request: NextRequest) {
    const isAuthenticated = !!(await getCookie(config.api.bearerTokenCookieName))
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  })
}

export function membersOnlyMode() {
  return runMiddlewareIfPathMatches(/^(?!\/$|\/auth\/).*$/)(async function (request: NextRequest) {
    const isAuthenticated = !!(await getCookie(config.api.bearerTokenCookieName))
    if (membersOnly && !isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  })
}

export function anonymousNotAllowed(path: RegExp, redirectTo: string) {
  return runMiddlewareIfPathMatches(path)(async function (request: NextRequest) {
    const isAuthenticated = !!(await getCookie(config.api.bearerTokenCookieName))
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  })
}
