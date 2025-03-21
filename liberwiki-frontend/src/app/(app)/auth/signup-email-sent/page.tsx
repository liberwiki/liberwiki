import type { Metadata } from 'next'

import SignupEmailSent from '@/components/liberwiki/Auth/SignupEmailSent'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
    noIndex: true,
  })
}

export default async function SignupEmailSentPage() {
  return <SignupEmailSent />
}
