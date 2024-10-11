import type { Metadata } from 'next'

import React from 'react'

import config from '@/config/config'

export const metadata: Metadata = {
  title: config.name,
  description: config.name,
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center min-h-screen">{children}</div>
}
