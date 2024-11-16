import React from 'react'

export default async function LockdownLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex items-center justify-center min-h-screen">{children}</main>
}
