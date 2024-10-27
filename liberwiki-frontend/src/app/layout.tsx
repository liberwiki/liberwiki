import '~/src/app/globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import React from 'react'

import { Toaster } from '@/components/shadcn/sonner'

import config from '@/config'
import { cn } from '@/lib/utils'
import { AuthProvider, QueryClientProvider } from '@/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: config.name,
  description: config.name,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <html lang="en" suppressHydrationWarning>
          <head title="liberwiki">
            <title>{config.name}</title>
          </head>
          <body className={cn('min-h-screen font-sans antialiased dark', inter.className)}>
            {children}
            <Toaster />
          </body>
        </html>
      </AuthProvider>
    </QueryClientProvider>
  )
}
