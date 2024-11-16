import type { Metadata } from 'next'

import LockDown from '@/components/liberwiki/LockDown'

import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await sUseTranslation(['metadata'])
  return await getLiberWikiMetadata({
    title: config.name,
    description: t('metadata:lockdown.description', { name: config.name }),
  })
}

export default async function LockDownPage() {
  return <LockDown />
}
