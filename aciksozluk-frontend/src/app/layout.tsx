import '~/src/app/globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import React from 'react'

import { Toaster } from '@/components/shadcn/sonner'

import Providers from '@/app/providers'
import config from '@/config/config'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: config.name,
  description: config.name,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <head title="aciksozluk" />
        <body className={cn('min-h-screen bg-background font-sans antialiased dark', inter.className)}>
          {children}
          <Toaster />
        </body>
      </html>
    </Providers>
  )
}
