import type { Metadata } from 'next'

import Signup from '@/components/liberwiki/Signup'

import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { getLiberWikiMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await sUseTranslation(['metadata'])
  return await getLiberWikiMetadata({
    title: t('metadata:signup.title', { name: config.name }),
    description: t('metadata:signup.description', { name: config.name }),
  })
}

export default async function SignupPage() {
  return <Signup />
}
