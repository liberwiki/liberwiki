'use client'

import Link from 'next/link'

import * as React from 'react'

import config from '@/config/config'

export function NavTitle({ id, children }: { id: string; children: React.ReactNode }) {
  const href = `${config.exampleLink}/${id}`
  return (
    <Link
      className="mb-1 rounded-md px-2 py-2 text-sm hover:bg-accent text-muted-foreground w-full flex justify-between items-center"
      href={href}
    >
      <span>{children}</span>
      <small className="text-right">{id}</small>
    </Link>
  )
}
