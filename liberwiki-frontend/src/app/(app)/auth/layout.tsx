import Link from 'next/link'

import React from 'react'

import { sUseTranslation } from '@/i18n'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = await sUseTranslation(['common'])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-2">
      {children}
      <Link prefetch={true} href={{ pathname: '/' }} className="hover:underline">
        {t('common:backToWebsite')}
      </Link>
    </main>
  )
}
