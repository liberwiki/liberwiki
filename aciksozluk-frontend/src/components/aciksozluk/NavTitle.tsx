import * as React from 'react'

import config from '@/config/config'

import Link from 'next/link'

interface NavTitleProps {
  titleId: string
  children: React.ReactNode
}

export function NavTitle({ titleId, children }: NavTitleProps) {
  const href = `${config.exampleLink}/${titleId}`
  return (
    <Link
      className="mb-1 rounded-md px-2 py-2 text-sm hover:bg-accent text-muted-foreground w-full block flex justify-between items-center"
      href={href}
    >
      <span>{children}</span>
      <small className="text-right">{titleId}</small>
    </Link>
  )
}
