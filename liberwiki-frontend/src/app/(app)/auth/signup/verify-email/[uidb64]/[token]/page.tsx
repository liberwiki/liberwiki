import type { Metadata } from 'next'

import VerifyEmail from '@/components/liberwiki/VerifyEmail'

import { noIndex } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return noIndex
}

export default async function VerifyEmailPage({ params }: { params: { uidb64: string; token: string } }) {
  return <VerifyEmail uidb64={params.uidb64} token={params.token} />
}
