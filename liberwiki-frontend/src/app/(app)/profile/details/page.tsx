import type { Metadata } from 'next'

import Details from '@/components/liberwiki/Profile/Details'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function DetailsPage() {
  return <Details />
}
