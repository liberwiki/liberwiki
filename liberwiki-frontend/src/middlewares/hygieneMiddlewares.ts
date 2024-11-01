import { NextRequest, NextResponse } from 'next/server'

import _ from 'lodash'

export async function queryParamHygiene(request: NextRequest) {
  const url = request.nextUrl
  const params = url.searchParams

  const cleanedParams = _.omitBy(Object.fromEntries(params.entries()), (value) => value === '')

  if (Object.keys(cleanedParams).length !== params.size) {
    url.search = new URLSearchParams(cleanedParams).toString()
    return NextResponse.redirect(url)
  }
}
