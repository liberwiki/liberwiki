import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'

import { useClientTranslation } from '@/i18n'
import { cn } from '@/lib/utils'

export function Paginator({
  currentPage,
  totalPages,
  onPageChange,
  className,
  force = false,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (p: number) => void
  className?: string
  force?: boolean
}) {
  const { t } = useClientTranslation(['paginator'])

  if (!force && totalPages <= 1) {
    return null
  }
  return (
    <div className={cn('flex w-full items-center justify-end gap-2', className)}>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        aria-label={t('paginator:previousPage')}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <Icons.ChevronLeft className="h-3 w-3" />
      </Button>
      <div className="flex items-center gap-2 !ml-0">
        <Select value={currentPage.toString()} onValueChange={(value) => onPageChange(parseInt(value))}>
          <SelectTrigger className="w-16 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <SelectItem key={page} value={page.toString()}>
                {page}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>/</span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          aria-label={t('paginator:maxPage')}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        aria-label={t('paginator:nextPage')}
        className="!ml-0"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <Icons.ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  )
}
