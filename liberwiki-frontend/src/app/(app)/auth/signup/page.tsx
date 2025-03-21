import type { Metadata } from 'next'

import Signup from '@/components/liberwiki/Auth/Signup'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function SignupPage() {
  return <Signup />
}
