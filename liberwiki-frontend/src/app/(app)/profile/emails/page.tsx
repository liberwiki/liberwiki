import type { Metadata } from 'next'

import Emails from '@/components/liberwiki/Profile/Emails'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function EmailsPage() {
  return <Emails />
}
