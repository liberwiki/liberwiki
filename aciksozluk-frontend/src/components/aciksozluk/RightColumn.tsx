'use client'

import { AspectRatio } from '@/components/shadcn/aspect-ratio'
import { cn } from '@/lib/utils'

export function RightColumn() {
  return (
    <div className="w-full">
      <div className={cn('pb-4')}>
        <div className="py-1">
          <AspectRatio ratio={16 / 9} className="bg-muted" />
        </div>
        <div className="py-1">
          <AspectRatio ratio={16 / 9} className="bg-muted" />
        </div>
        <div className="py-1">
          <AspectRatio ratio={16 / 9} className="bg-muted" />
        </div>
      </div>
    </div>
  )
}
