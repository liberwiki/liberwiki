import React from 'react'

import { Footer } from '@/components/aciksozluk/Footer'
import { Header } from '@/components/aciksozluk/Header'
import { LeftColumn } from '@/components/aciksozluk/LeftColumn'
import { RightColumn } from '@/components/aciksozluk/RightColumn'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Toaster } from '@/components/shadcn/toaster'
import { cn } from '@/lib/utils'

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ACIKSOZLUK',
  description: 'ACIKSOZLUK',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased dark', inter.className)}>
        <Header />
        <div vaul-drawer-wrapper="">
          <div className="relative flex min-h-screen flex-col bg-background">
            <div className="border-b">
              <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)_220px] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)_240px] lg:gap-10 max-md:px-0">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
                  <ScrollArea className="h-full py-6 pr-6 lg:py-8">
                    <LeftColumn />
                  </ScrollArea>
                </aside>
                {children}
                <aside className="fixed top-14 z-30 -mr-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block foobarbaz">
                  <ScrollArea className="h-full py-6 pl-6 lg:py-8">
                    <RightColumn />
                  </ScrollArea>
                </aside>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
