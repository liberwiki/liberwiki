import type { Metadata } from 'next'

import Login from '@/components/liberwiki/Login'

import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await sUseTranslation(['metadata'])
  return await getLiberWikiMetadata({
    title: t('metadata:login.title', { name: config.name }),
    description: t('metadata:login.description', { name: config.name }),
  })
}

export default async function LoginPage() {
  return <Login />
}
