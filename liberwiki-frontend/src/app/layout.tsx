import '~/src/app/globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import React from 'react'

import { Toaster } from '@/components/shadcn/sonner'

import MonkeyPatches from '@/app/monkeypatches'
import config from '@/config'
import { cn } from '@/lib/utils'

import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: config.name,
  description: config.name,
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
      <body className={cn('min-h-screen font-sans antialiased dark', inter.className)}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
