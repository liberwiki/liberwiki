'use client'

import { useEffect, useState } from 'react'

import * as Icons from 'lucide-react'

import NavTitle from '@/components/aciksozluk/NavTitle'
import Paginator from '@/components/aciksozluk/Paginator'
import { Button } from '@/components/shadcn/button'
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/shadcn/sheet'

import { useAcikSozlukAPI } from '@/lib/serverHooks'

export function MobileNav() {
  const aciksozluk = useAcikSozlukAPI()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { isSuccess, data: titles, refetch } = aciksozluk.titles({ page: currentPage, entry_count__gt: 0 })

  useEffect(() => {
    refetch()
  }, [currentPage, refetch])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Icons.Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-2">
        <ScrollArea className="my-4 h-[calc(100vh-4rem)] pr-0">
          <div className="flex flex-col">
            <Paginator
              currentPage={currentPage}
              totalPages={titles?.total_pages || 1}
              onPageChange={setCurrentPage}
              className="mt-1 justify-center"
            />
            {isSuccess &&
              titles?.results?.map((title) => (
                <NavTitle key={title.id} title={title}>
                  {title.name}
                </NavTitle>
              ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
