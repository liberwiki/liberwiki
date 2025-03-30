import type { Metadata } from 'next'

import CompleteSignup from '@/components/liberwiki/Profile/CompleteSignup'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function DetailsPage() {
  return <CompleteSignup />
}
