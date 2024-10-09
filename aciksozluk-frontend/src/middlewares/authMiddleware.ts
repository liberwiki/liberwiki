import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import config from '@/config/config'
import { getCookie } from '@/lib/serverActions'
import { runMiddlewareIfPathStartsWith } from '@/lib/utils'

export default runMiddlewareIfPathStartsWith(/^\/auth\//)(async function (request: NextRequest) {
  const isAuthenticated = !!(await getCookie(config.api.bearerTokenCookieName))
  if (isAuthenticated) {
    return NextResponse.redirect(new URL('/titles', request.url))
  }
})
