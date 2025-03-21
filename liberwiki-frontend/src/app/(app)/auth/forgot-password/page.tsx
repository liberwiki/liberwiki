import type { Metadata } from 'next'

import ForgotPassword from '@/components/liberwiki/Auth/ForgotPassword'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function ForgotPasswordPage() {
  return <ForgotPassword />
}
