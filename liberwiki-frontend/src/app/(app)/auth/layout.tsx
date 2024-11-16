import Link from 'next/link'

import React from 'react'

import config from '@/config'
import { sUseTranslation } from '@/i18n'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = await sUseTranslation(['common'])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-2">
      {children}
      {!config.membersOnly && (
        <div className="w-100 flex justify-center">
          <Link prefetch={true} href={{ pathname: '/' }} className="hover:underline">
            {t('common:backToWebsite')}
          </Link>
        </div>
      )}
    </main>
  )
}
