import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import * as AuthMiddlewares from '@/middlewares/authMiddlewares'

const middlewares: ((request: NextRequest) => Promise<NextResponse | void>)[] = [
  AuthMiddlewares.redirectAuthenticatedBackToTitles,
  AuthMiddlewares.redirectAnonymousToIndex,
]

export async function middleware(request: NextRequest) {
  for (const mw of middlewares) {
    const response = await mw(request)
    if (response) {
      return response
    }
  }
  return NextResponse.next()
}
