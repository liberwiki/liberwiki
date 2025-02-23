import Link from 'next/link'

import React from 'react'

import config from '@/config'
import { sUseTranslation } from '@/i18n'

export default async function EntriesLayout({ children }: { children: React.ReactNode }) {
  const { t } = await sUseTranslation(['common'])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-2 py-6">
      {children}
      <div className="w-full flex justify-center">
        {!config.membersOnly && (
          <Link prefetch={true} href={{ pathname: '/' }} className="hover:underline">
            {t('common:backToWebsite')}
          </Link>
        )}
      </div>
    </main>
  )
}
