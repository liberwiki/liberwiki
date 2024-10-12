'use client'

import { useState } from 'react'

import NavTitle from '@/components/aciksozluk/NavTitle'
import Paginator from '@/components/aciksozluk/Paginator'
import { Skeleton } from '@/components/shadcn/skeleton'

import { useAcikSozlukAPI } from '@/lib/serverHooks'

export function LeftColumn() {
  const aciksozluk = useAcikSozlukAPI()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { isLoading, data: titles } = aciksozluk.titles({ page: currentPage, entry_count__gt: 0 })

  return (
    <>
      <Paginator
        currentPage={currentPage}
        totalPages={titles?.total_pages || 1}
        onPageChange={setCurrentPage}
        className="mt-1"
      />
      <div className="w-full">
        <div className="pb-4">
          {isLoading ? (
            <Skeleton className="w-full h-48" />
          ) : (
            titles?.results?.map((title) => (
              <NavTitle key={title.id} title={title}>
                {title.name}
              </NavTitle>
            ))
          )}
        </div>
      </div>
    </>
  )
}
