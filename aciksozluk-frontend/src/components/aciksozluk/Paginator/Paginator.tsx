import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'

export function Paginator({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  return (
    <div className="flex w-full items-center justify-end space-x-6 gap-2">
      <Button variant="outline" size="sm" disabled={currentPage === 1} aria-label="Previous page">
        <Icons.ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center space-x-2 !ml-0">
        <Select value={currentPage.toString()}>
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
        <Button variant="outline" size="sm" disabled={currentPage === totalPages} aria-label="Max Page">
          {totalPages}
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="!ml-0"
      >
        <Icons.ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
