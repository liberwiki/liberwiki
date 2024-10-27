'use client'

import Link from 'next/link'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import Editor from '@/components/liberwiki/Editor'
import Entry from '@/components/liberwiki/Entry'
import Paginator from '@/components/liberwiki/Paginator'
import { Button } from '@/components/shadcn/button'
import { Calendar } from '@/components/shadcn/calendar'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Label } from '@/components/shadcn/label'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Separator } from '@/components/shadcn/separator'

import { APIType, includesType } from '@/api'
import config from '@/config'
import { useClientTranslation } from '@/i18n'
import { useFormState } from '@/lib/hooks'
import { useLiberWikiAPI } from '@/lib/serverHooks'
import { preventDefault } from '@/lib/utils'
import { useAuth } from '@/providers/authProvider'

import { format } from 'date-fns'
import { toast } from 'sonner'

export function Title({ title }: { title: APIType<'Title'> }) {
  const entryPerPage = config.ux.defaultEntryPageSize
  const liberwiki = useLiberWikiAPI()
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { t } = useClientTranslation(['common', 'title', 'entry', 'advancedEntrySearch'])

  const queryClient = liberwiki.useQueryClient()
  const { mutateAsync: createEntry } = liberwiki.createEntry()
  const { mutateAsync: bookmarkTitle } = liberwiki.bookmarkTitle(title.id)
  const { mutateAsync: unbookmarkTitle } = liberwiki.unbookmarkTitle(title.id)

  const [isBookmarked, setIsBookmarked] = useState<boolean>(title.is_bookmarked)

  const {
    formState: searchState,
    handleFormStateValue: handleSearchStateValue,
    handleFormStateOnClick: handleSearchStateOnClick,
  } = useFormState<{
    mine: boolean
    fromDate: Date | undefined
    toDate: Date | undefined
    orderBy: 'chronological' | 'likes' | 'dislikes' | 'bookmarks'
  }>({
    mine: false,
    fromDate: undefined,
    toDate: undefined,
    orderBy: 'chronological',
  })

  const { isSuccess, data: entries } = liberwiki.entries({
    page: currentPage,
    title__slug: title.slug,
    page_size: entryPerPage,
    include: 'author',
    author: searchState.mine ? user?.id : undefined,
    created_at__gte: searchState.fromDate ? format(searchState.fromDate, 'yyyy-MM-dd') : undefined,
    created_at__lte: searchState.toDate ? format(searchState.toDate, 'yyyy-MM-dd') : undefined,
    ordering: {
      chronological: 'created_at',
      likes: '-like_count',
      dislikes: '-dislike_count',
      bookmarks: '-bookmark_count',
    }[searchState.orderBy] as 'created_at' | '-like_count' | '-dislike_count' | '-bookmark_count',
    // TODO: figure out why we need this ^ as here as it seems like TS should be able to figure it out
  })

  async function handleEditorSubmit(content: object) {
    const { response: createEntryResponse } = await createEntry({ title: title?.id as string, content })
    if (createEntryResponse.ok) {
      toast(t('entry:yourEntryHasBeenCreated'))
      await queryClient.invalidateQueries({ queryKey: ['titles'] })
      await queryClient.invalidateQueries({ queryKey: ['entries'] })
      if (entries) {
        // If the current page is full, and a new entry is created, go to the next page
        setCurrentPage(entries.count % entryPerPage === 0 ? entries.total_pages + 1 : entries.total_pages)
      }
    } else {
      toast(t('entry:entryCreationError'))
    }
  }

  async function handleEntryDelete() {
    // I couldn't get this logic working without explicitly passing a function to the Entry component
    if (entries) {
      // If current page only has 1 entry, and it is deleted, go to the previous page
      setCurrentPage(entries.count % entryPerPage === 1 ? entries.total_pages - 1 : entries.total_pages)
    }
  }

  async function handleBookmark() {
    setIsBookmarked(!isBookmarked)
    await (isBookmarked ? unbookmarkTitle() : bookmarkTitle())
    await queryClient.invalidateQueries({ queryKey: ['titles', { slug: title.slug, page_size: 1, page: 1 }] })
  }

  const orderingLabels = {
    chronological: t('advancedEntrySearch:orderByChronological'),
    likes: t('advancedEntrySearch:orderByLikes'),
    dislikes: t('advancedEntrySearch:orderByDislikes'),
    bookmarks: t('advancedEntrySearch:orderByBookmarks'),
  }

  return (
    <>
      <div className="w-full">
        <Link className="h-1 p-6 text-xl font-bold" href={{ pathname: `/titles/${title.slug}` }}>
          {title.name}
        </Link>
        <div className="text-sm px-6 py-2 text-gray-500 flex justify-between items-center max-lg:flex-wrap">
          <div className="gap-6 flex w-full items-center">
            <Overlay breakpoint="md">
              <OverlayTrigger>
                <Button variant="ghost" className="px-0 hover:bg-transparent">
                  <p className="font-medium text-primary hover:underline">
                    {`${t('advancedEntrySearch:currentOrdering')}: ${orderingLabels[searchState.orderBy]}`}
                  </p>
                </Button>
              </OverlayTrigger>
              <OverlayContent align="start" side="bottom">
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSearchStateOnClick('orderBy', 'chronological')}
                  >
                    {t('advancedEntrySearch:orderByChronological')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSearchStateOnClick('orderBy', 'likes')}
                  >
                    {t('advancedEntrySearch:orderByLikes')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSearchStateOnClick('orderBy', 'dislikes')}
                  >
                    {t('advancedEntrySearch:orderByDislikes')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSearchStateOnClick('orderBy', 'bookmarks')}
                  >
                    {t('advancedEntrySearch:orderByBookmarks')}
                  </Button>
                </div>
              </OverlayContent>
            </Overlay>
            <Overlay breakpoint="md">
              <OverlayTrigger>
                <Button variant="ghost" className="px-0 hover:bg-transparent">
                  <p className="font-medium text-primary hover:underline">{t('common:search')}</p>
                </Button>
              </OverlayTrigger>
              <OverlayContent align="start" side="bottom" className="w-full">
                <div className="grid gap-6 md:w-96">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-lg leading-none">
                      {t('advancedEntrySearch:advancedEntrySearch')}
                    </h4>
                    <p className="text-sm text-muted-foreground">{t('advancedEntrySearch:refineYourSearch')}</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="fromDate">{t('advancedEntrySearch:fromDate')}</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={'outline'}
                                className={`w-full text-left font-normal justify-between ${!searchState.fromDate && 'text-muted-foreground'}`}
                              >
                                {searchState.fromDate ? (
                                  format(searchState.fromDate, 'PPP')
                                ) : (
                                  <span>{t('advancedEntrySearch:pickADate')}</span>
                                )}
                                {searchState.fromDate && (
                                  <Icons.X
                                    className="h-4 w-4"
                                    onClick={preventDefault(handleSearchStateOnClick('fromDate', undefined))}
                                  />
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={searchState.fromDate}
                                onSelect={handleSearchStateValue('fromDate')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="toDate">{t('advancedEntrySearch:toDate')}</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={'outline'}
                                className={`w-full text-left font-normal justify-between ${!searchState.toDate && 'text-muted-foreground'}`}
                              >
                                {searchState.toDate ? (
                                  format(searchState.toDate, 'PPP')
                                ) : (
                                  <span>{t('advancedEntrySearch:pickADate')}</span>
                                )}
                                {searchState.toDate && (
                                  <Icons.X
                                    className="h-4 w-4"
                                    onClick={preventDefault(handleSearchStateOnClick('toDate', undefined))}
                                  />
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={searchState.toDate}
                                onSelect={handleSearchStateValue('toDate')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <Checkbox
                        id="mine"
                        name="mine"
                        checked={searchState.mine}
                        onCheckedChange={(checked) => handleSearchStateValue('mine')(checked as boolean)}
                      />
                      <Label htmlFor="mine">{t('advancedEntrySearch:mine')}</Label>
                    </div>
                  </div>
                </div>
              </OverlayContent>
            </Overlay>
            <Button variant="ghost" className="px-0 hover:bg-transparent" onClick={handleBookmark}>
              <p className="font-medium text-primary hover:underline">
                {title.is_bookmarked ? t('title:follow') : t('title:unfollow')}
              </p>
            </Button>
          </div>
          <Paginator
            currentPage={currentPage}
            totalPages={entries?.total_pages || 1}
            onPageChange={setCurrentPage}
            className="mt-1"
          />
        </div>
        <div className="mt-2 px-6">
          <Separator />
        </div>
      </div>
      {isSuccess &&
        entries &&
        ((entries.results.length || 0) > 0 ? (
          entries.results.map((entry) => (
            <Entry key={entry.id} entry={includesType(entry, 'author', 'User')} onDelete={handleEntryDelete} />
          ))
        ) : (
          <div className="text-center text-gray-500 p-10">{t('title:noEntryFound')}</div>
        ))}
      <div className="p-2 w-full">
        <Editor readonly={false} onSubmit={handleEditorSubmit} />
      </div>
    </>
  )
}
