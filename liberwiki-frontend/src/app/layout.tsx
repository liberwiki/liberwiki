import '~/src/app/globals.css'

import type { Metadata } from 'next'

import React from 'react'

import { Toaster } from '@/components/shadcn/sonner'

import MonkeyPatches from '@/app/monkeypatches'
import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { getLiberWikiMetadata } from '@/lib/metadata'
import { cn } from '@/lib/utils'

import { GoogleAnalytics } from '@next/third-parties/google'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await sUseTranslation(['metadata'])
  return await getLiberWikiMetadata({
    title: config.name,
    description: t('metadata:fallback.description', { name: config.name }),
  })
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaID = config.devtools.googleAnalytics.gaID
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <MonkeyPatches />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
          name="viewport"
        />
        {gaID && <GoogleAnalytics gaId={gaID} />}
      </head>
      <body className={cn('min-h-screen font-sans antialiased dark')}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
