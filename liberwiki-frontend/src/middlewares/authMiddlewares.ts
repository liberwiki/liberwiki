import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import config from '@/config'
import { useLiberWikiAPI } from '@/lib/serverHooks'
import { runMiddlewareIfPathMatches } from '@/lib/utils'

const membersOnly = config.membersOnly

export function redirectAuthenticatedIncompleteSignup(path: RegExp, redirectTo: string) {
  return runMiddlewareIfPathMatches(path)(async function (request: NextRequest) {
    const liberwiki = useLiberWikiAPI()
    const isAuthenticated = await liberwiki.isAuthenticated()
    const signupCompleted = await liberwiki.signupCompleted()
    if (isAuthenticated && !signupCompleted) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  })
}

export function redirectAuthenticatedBackTo(path: RegExp, redirectTo: string) {
  return runMiddlewareIfPathMatches(path)(async function (request: NextRequest) {
    const liberwiki = useLiberWikiAPI()
    const isAuthenticated = await liberwiki.isAuthenticated()
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  })
}

export function membersOnlyMode(allowedPath: RegExp, redirectTo: string) {
  return runMiddlewareIfPathMatches(allowedPath)(async function (request: NextRequest) {
    const liberwiki = useLiberWikiAPI()
    const isAuthenticated = await liberwiki.isAuthenticated()
    if (membersOnly && !isAuthenticated) {
      return NextResponse.rewrite(new URL(redirectTo, request.url))
    }
  })
}

export function anonymousNotAllowed(path: RegExp, redirectTo: string) {
  return runMiddlewareIfPathMatches(path)(async function (request: NextRequest) {
    const liberwiki = useLiberWikiAPI()
    const isAuthenticated = await liberwiki.isAuthenticated()
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  })
}
