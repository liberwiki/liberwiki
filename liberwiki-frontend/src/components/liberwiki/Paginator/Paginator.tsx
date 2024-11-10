import Link from 'next/link'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import { buttonVariants } from '@/components/shadcn/button'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'
import { ScrollArea } from '@/components/shadcn/scroll-area'

import { sUseTranslation } from '@/i18n'
import { cn } from '@/lib/utils'

export async function Paginator({
  pageQueryParamName = 'page',
  pathname,
  queryParams,
  currentPage,
  totalPages,
  className,
  force = false,
}: {
  pageQueryParamName?: string
  pathname?: string
  queryParams: Record<string, string | number | boolean | undefined>
  currentPage: number
  totalPages: number
  className?: string
  force?: boolean
}) {
  const { t } = await sUseTranslation(['paginator'])

  if (!force && totalPages <= 1) {
    return null
  }

  return (
    <div className={cn('flex w-full items-center justify-end gap-2', className)}>
      <Link
        prefetch={true}
        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        aria-label={t('paginator:previousPage')}
        href={{
          pathname,
          query: { ...queryParams, [pageQueryParamName]: _.max([Number(currentPage) - 1, 1]) },
        }}
      >
        <Icons.ChevronLeft className="h-3 w-3" />
      </Link>
      <div className="flex items-center gap-2 !ml-0">
        <Overlay breakpoint="md">
          <OverlayTrigger asChild>
            <button
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'w-16 h-9 flex justify-between items-center'
              )}
            >
              {currentPage}
              <Icons.ChevronDown className="h-3 w-3" />
            </button>
          </OverlayTrigger>
          <OverlayContent side="bottom" popoverContentProps={{ className: 'w-36' }}>
            <ScrollArea>
              <div className="flex flex-col max-h-48">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    prefetch={true}
                    className={cn(buttonVariants({ variant: 'ghost', className: 'w-full justify-center' }))}
                    href={{ pathname, query: { ...queryParams, [pageQueryParamName]: Number(page) } }}
                    key={page}
                  >
                    {page}
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </OverlayContent>
        </Overlay>
        <span>/</span>
        <Link
          prefetch={true}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          aria-label={t('paginator:maxPage')}
          href={{ pathname, query: { ...queryParams, [pageQueryParamName]: Number(totalPages) } }}
        >
          {totalPages}
        </Link>
      </div>
      <Link
        prefetch={true}
        className={cn(buttonVariants({ variant: 'outline', size: 'sm', className: '!ml-0' }))}
        aria-label={t('paginator:nextPage')}
        href={{
          pathname,
          query: { ...queryParams, [pageQueryParamName]: _.min([Number(currentPage) + 1, totalPages]) },
        }}
      >
        <Icons.ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
