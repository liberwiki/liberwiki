'use client'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import NavTitle from '@/components/liberwiki/NavTitle'
import Paginator from '@/components/liberwiki/Paginator'
import { Button } from '@/components/shadcn/button'
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/shadcn/sheet'

import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

export function MobileNav() {
  const liberwiki = useLiberWikiAPI()
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { t } = useClientTranslation(['common'])

  const { isSuccess, data: titles } = liberwiki.titles({ page: currentPage, entry_count__gt: 0 })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 xl:hidden"
        >
          <Icons.Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-2">
        <SheetHeader className="hidden">
          <SheetTitle className="hidden">{t('common:navigation')}</SheetTitle>
          <SheetDescription className="hidden">{t('common:navigation')}</SheetDescription>
        </SheetHeader>
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
                <SheetClose asChild key={title.id}>
                  <NavTitle key={title.id} title={title}>
                    {title.name}
                  </NavTitle>
                </SheetClose>
              ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
