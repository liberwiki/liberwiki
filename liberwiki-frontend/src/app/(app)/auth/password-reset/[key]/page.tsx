import type { Metadata } from 'next'

import PasswordRest from '@/components/liberwiki/Auth/PasswordReset'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
    noIndex: true,
  })
}

export default async function PasswordResetPage({ params }: { params: { key: string } }) {
  return <PasswordRest passwordResetKey={params.key} />
}
