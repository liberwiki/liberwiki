import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { useAcikSozlukAPI } from '@/lib/hooks'
import { runMiddlewareIfPathStartsWith } from '@/lib/utils'

export default runMiddlewareIfPathStartsWith(/^\/auth\//)(async function (request: NextRequest) {
  const aciksozluk = useAcikSozlukAPI()
  const isAuthenticated = await aciksozluk.isAuthenticated()
  if (isAuthenticated) {
    return NextResponse.redirect(new URL('/titles', request.url))
  }
})
