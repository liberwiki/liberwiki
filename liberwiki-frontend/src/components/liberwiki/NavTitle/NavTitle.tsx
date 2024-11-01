import Link from 'next/link'

import * as React from 'react'

import { APIType } from '@/api'
import { cn } from '@/lib/utils'

// TODO@next15: Remove forwardRef and turn this back to a function component
// Currently we need the forwardRef for SheetClose and PopoverClose to work
export const NavTitle = React.forwardRef<
  React.ElementRef<typeof Link>,
  Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href' | 'title'> & {
    title: APIType<'Title'>
    children: React.ReactNode
  }
>(({ title, children, className, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      className={cn(
        'rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent',
        'focus:text-accent-foreground focus:outline-none text-muted-foreground w-full flex',
        'justify-between items-center break-all gap-2 transition-colors',
        className
      )}
      href={{ pathname: `/titles/${title.slug}` }}
      {...props}
    >
      <span>{children}</span>
      <small className="text-right break-normal" aria-label={`${title.entry_count} entries`}>
        {title.entry_count}
      </small>
    </Link>
  )
})

NavTitle.displayName = 'NavTitle'
