import type { Metadata } from 'next'

import Password from '@/components/liberwiki/Profile/Password'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function PasswordPage() {
  return <Password />
}
