import type { Metadata } from 'next'

import CheckEmail from '@/components/liberwiki/CheckEmail'

import { noIndex } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return noIndex
}

export default async function CheckEmailPage() {
  return <CheckEmail />
}
