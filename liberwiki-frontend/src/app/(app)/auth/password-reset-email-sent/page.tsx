import type { Metadata } from 'next'

import PasswordResetEmailSent from '@/components/liberwiki/Auth/PasswordResetEmailSent'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
    noIndex: true,
  })
}

export default async function PasswordResetEmailSentPage() {
  return <PasswordResetEmailSent />
}
