import type { Metadata } from 'next'

import Connections from '@/components/liberwiki/Profile/Connections'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function ConnectionsPage() {
  return <Connections />
}
