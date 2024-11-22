import React from 'react'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-col items-center justify-center min-h-screen gap-2">{children}</main>
}
