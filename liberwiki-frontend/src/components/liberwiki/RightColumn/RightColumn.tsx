import { AspectRatio } from '@/components/shadcn/aspect-ratio'

import { cn } from '@/lib/utils'

export async function RightColumn() {
  return (
    <div className="w-full">
      <div className={cn('pb-4')}>
        <div className="py-1">
          <AspectRatio ratio={16 / 9} className="bg-black" />
        </div>
        <div className="py-1">
          <AspectRatio ratio={16 / 9} className="bg-black" />
        </div>
        <div className="py-1">
          <AspectRatio ratio={16 / 9} className="bg-black" />
        </div>
      </div>
    </div>
  )
}
