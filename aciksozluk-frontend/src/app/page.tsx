'use client'

import LockDown from '@/components/aciksozluk/LockDown'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 pt-6">
      <div className="flex items-center justify-center min-h-screen">
        <LockDown />
      </div>
    </main>
  )
}
