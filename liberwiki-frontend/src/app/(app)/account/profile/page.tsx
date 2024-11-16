import { Metadata } from 'next'

import Profile from '@/components/liberwiki/Profile'

import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await sUseTranslation(['metadata'])
  return await getLiberWikiMetadata({
    title: t('metadata:profile.title', { name: config.name }),
    description: t('metadata:profile.description', { name: config.name }),
    noIndex: true,
  })
}

export default async function ProfilePage() {
  return <Profile />
}
