import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import authMiddleware from '@/middlewares/authMiddleware'

const middlewares: ((request: NextRequest) => Promise<NextResponse | void>)[] = [authMiddleware]

export async function middleware(request: NextRequest) {
  for (const mw of middlewares) {
    const response = await mw(request)
    if (response) {
      return response
    }
  }
  return NextResponse.next()
}
