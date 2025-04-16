import { NextResponse } from 'next/server'

// @ts-ignore TS-2307: no idea why it errors on this specific file and nowhere else, ignoring for my own sanity
import config from '@/config'

export async function GET() {
  const data = {
    associatedApplications: [
      {
        applicationId: config.verification.microsoft.associatedApplicationID,
      },
    ],
  }
  return NextResponse.json(data)
}
