import type { Metadata } from 'next'

import React from 'react'

import config from '@/config'

export const metadata: Metadata = {
  title: config.name,
  description: config.name,
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex items-center justify-center min-h-screen">{children}</main>
}
