import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import config from '@/config/config'
import { getCookie } from '@/lib/serverActions'
import { runMiddlewareIfPathMatches } from '@/lib/utils'

export const redirectAuthenticatedBackToTitles = runMiddlewareIfPathMatches(/^\/auth\//)(async function (
  request: NextRequest
) {
  const isAuthenticated = !!(await getCookie(config.api.bearerTokenCookieName))
  if (isAuthenticated) {
    return NextResponse.redirect(new URL('/titles', request.url))
  }
  return NextResponse.next()
})

export const redirectAnonymousToIndex = runMiddlewareIfPathMatches(/^(?!\/$|\/auth\/).*$/)(async function (
  request: NextRequest
) {
  const isAuthenticated = !!(await getCookie(config.api.bearerTokenCookieName))
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
})
