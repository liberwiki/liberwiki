'use client'

import Link from 'next/link'

import * as React from 'react'

import { components } from '@/api/schema'

export function NavTitle({ title, children }: { children: React.ReactNode; title: components['schemas']['Title'] }) {
  return (
    <Link
      className="mb-1 rounded-md px-2 py-2 text-sm hover:bg-accent text-muted-foreground w-full flex justify-between items-center"
      href={`/titles/${title.slug}`}
    >
      <span>{children}</span>
      <small className="text-right">{title.entry_count}</small>
    </Link>
  )
}
