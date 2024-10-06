'use client'

import { useEffect, useState } from 'react'

import NavTitle from '@/components/aciksozluk/NavTitle'

import { useAcikSozlukAPI } from '@/lib/hooks'

import { Paginator } from '../Paginator/Paginator'

export function LeftColumn() {
  const aciksozluk = useAcikSozlukAPI()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { isSuccess, data: titles, refetch } = aciksozluk.titles({ page: currentPage, entry_count__gt: 0 })

  useEffect(() => {
    refetch()
  }, [currentPage, refetch])

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
          {isSuccess &&
            titles?.results?.map((title) => (
              <NavTitle key={title.id} title={title}>
                {title.name}
              </NavTitle>
            ))}
        </div>
      </div>
    </>
  )
}
