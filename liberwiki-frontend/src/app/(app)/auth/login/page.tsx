import type { Metadata } from 'next'

import Login from '@/components/liberwiki/Auth/Login'

import config from '@/config'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return await getLiberWikiMetadata({
    title: config.name,
    description: config.name,
  })
}

export default async function LoginPage() {
  return <Login />
}
