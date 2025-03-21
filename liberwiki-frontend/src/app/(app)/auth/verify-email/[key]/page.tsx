import type { Metadata } from 'next'

import VerifyEmail from '@/components/liberwiki/Auth/VerifyEmail'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
    noIndex: true,
  })
}

export default async function VerifyEmailPage({ params }: { params: { key: string } }) {
  return <VerifyEmail verificationKey={params.key} />
}
