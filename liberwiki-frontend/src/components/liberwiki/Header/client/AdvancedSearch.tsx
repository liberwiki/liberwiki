'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import { PopoverClose } from '@radix-ui/react-popover'

import { Button, buttonVariants } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { ScrollArea } from '@/components/shadcn/scroll-area'

import { APIType } from '@/api'
import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'
import { cn } from '@/lib/utils'

export default function AdvancedSearch() {
  const liberwiki = useLiberWikiAPI()
  const router = useRouter()
  const [search, setSearch] = React.useState<string>('')
  const [searchResults, setSearchResults] = React.useState<APIType<'Title'>[]>([])

  const { t } = useClientTranslation(['common', 'advancedTitleSearch'])

  const debouncedFetchRef = React.useRef(
    _.debounce(async (query: string) => {
      const { data: titles } = await liberwiki.titles({ name__icontains: query })
      setSearchResults(titles?.results || [])
    }, 300)
  )

  async function handleAutocomplete(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    setSearch(query)
    debouncedFetchRef.current(query)
  }

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { data: titles } = await liberwiki.titles({ page_size: 1, name__iexact: search })
    if (titles && titles.results.length !== 0) {
      router.push(`/titles/${_.first(titles?.results)?.slug}`)
    } else {
      router.push(`/titles/${search}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Input
              type="text"
              name="search"
              placeholder={t('common:search')}
              autoComplete="off"
              className="pr-20 h-10 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={search}
              onChange={handleAutocomplete}
            />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto"
            sideOffset={5}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <ScrollArea>
              <div className="flex flex-col max-h-48 px-2 py-4">
                {searchResults.map((title) => (
                  <PopoverClose asChild key={title.id}>
                    <Link
                      prefetch={true}
                      className={cn(buttonVariants({ variant: 'ghost', className: 'justify-start' }))}
                      href={`/titles/${title.slug}`}
                      key={title.id}
                    >
                      {title.name}
                    </Link>
                  </PopoverClose>
                ))}
                {searchResults.length === 0 && (
                  <PopoverClose asChild>
                    <div className={cn(buttonVariants({ variant: 'ghost', className: 'justify-start text-wrap' }))}>
                      {t('advancedTitleSearch:noResults')}
                    </div>
                  </PopoverClose>
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
          <Button type="submit" variant="ghost" size="icon" className="h-full px-2 hover:bg-transparent">
            <Icons.Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
