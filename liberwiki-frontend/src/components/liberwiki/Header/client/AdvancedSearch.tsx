'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'

import { useClientTranslation } from '@/i18n'
import { useElementAttribute, useFormState } from '@/lib/hooks'
import { useLiberWikiAPI } from '@/lib/serverHooks'

export default function AdvancedSearch() {
  const liberwiki = useLiberWikiAPI()
  const router = useRouter()

  const {
    // We are trying to keep the width of the popover the same as the search box
    // Proven too hard to do with only css/tailwind
    ref: searchBoxRef,
    attributeValue: popoverWidth,
  } = useElementAttribute<HTMLDivElement, keyof HTMLDivElement>('offsetWidth')
  const { t } = useClientTranslation(['common', 'advancedTitleSearch'])

  const { formState: searchState, handleFormStateEvent: handleSearchStateEvent } = useFormState<{
    search: string
  }>({
    search: '',
  })

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { data: titles } = await liberwiki.titles({ page_size: 1, name__iexact: searchState.search })
    if (titles && titles.results.length !== 0) {
      router.push(`/titles/${_.first(titles?.results)?.slug}`)
    } else {
      router.push(`/titles/${searchState.search}`)
    }
  }

  return (
    <>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative" ref={searchBoxRef}>
          <Input
            type="text"
            name="search"
            placeholder={t('common:search')}
            className="pr-20 h-10"
            value={searchState.search}
            onChange={handleSearchStateEvent('search')}
          />
          {
            <div className="absolute right-0 top-0 h-full flex items-center pr-3">
              <Overlay breakpoint="md" displayType="flex">
                <OverlayTrigger>
                  <Button type="button" variant="ghost" size="icon" className="h-full px-2 hover:bg-transparent">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </Button>
                </OverlayTrigger>
                <OverlayContent
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  popoverContentProps={{
                    align: 'end',
                    className: 'p-6 advanced-search-popover',
                    style: { width: `${popoverWidth}px` },
                  }}
                  sideOffset={8}
                  side="bottom"
                >
                  <div>Search results will appear here</div>
                </OverlayContent>
              </Overlay>
              <Button type="submit" variant="ghost" size="icon" className="h-full px-2 hover:bg-transparent">
                <Icons.Search className="h-4 w-4" />
              </Button>
            </div>
          }
        </div>
      </form>
      {/* TODO: This really grinds my gears, but I can't find a better way to do this */}
      {/* Ideally we should use some tailwind magic to handle these cases */}
      <style jsx global>{`
        div:has(> .advanced-search-popover) {
          left: 52px !important;
        }

        @media (max-width: 768px) {
          div:has(> .advanced-search-popover) {
            left: 48px !important;
            transform: translate(0, 52px) !important;
          }
        }
      `}</style>
    </>
  )
}
