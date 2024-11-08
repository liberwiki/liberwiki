import Link from 'next/link'

import _ from 'lodash'

import Entry from '@/components/liberwiki/Entry'
import Paginator from '@/components/liberwiki/Paginator'
import { FollowButton, NewEntryEditor } from '@/components/liberwiki/Title/client'
import { Button, buttonVariants } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Overlay, OverlayContent, OverlayTitle, OverlayTrigger } from '@/components/shadcn/overlay'
import { Separator } from '@/components/shadcn/separator'
import { SingleDateInput } from '@/components/shadcn/single-date-input'

import { APIQuery, APIType, includesType } from '@/api'
import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'
import { cn, optionalDate } from '@/lib/utils'

export async function Title({
  title,
  searchParams,
}: {
  title: APIType<'Title'>
  searchParams: APIQuery<'/v0/entries/'>
}) {
  const entryPerPage = config.ux.defaultEntryPageSize
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['common', 'title', 'entry', 'advancedEntrySearch'])

  const { data: entries } = await liberwiki.entries({
    page_size: entryPerPage,
    title__slug: title.slug,
    include: 'author,title',
    page: searchParams.page,
    author: searchParams.author,
    created_at__gte: searchParams.created_at__gte,
    created_at__lte: searchParams.created_at__lte,
    ordering: searchParams.ordering || 'created_at',
  })

  const orderingLabels = {
    created_at: t('advancedEntrySearch:orderByChronological'),
    '-like_count': t('advancedEntrySearch:orderByLikes'),
    '-dislike_count': t('advancedEntrySearch:orderByDislikes'),
    '-bookmark_count': t('advancedEntrySearch:orderByBookmarks'),
  }

  function newOrderingHref(ordering: APIQuery<'/v0/entries/'>['ordering']) {
    return { pathname: `/titles/${title.slug}`, query: { ...searchParams, ordering } }
  }

  const currentOrdering = _.get(orderingLabels, searchParams.ordering || 'created_at', orderingLabels.created_at)
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
                    {`${t('advancedEntrySearch:currentOrdering')}: ${currentOrdering}`}
                  </p>
                </Button>
              </OverlayTrigger>
              <OverlayContent align="start" side="bottom">
                <OverlayTitle className="hidden">Ordering</OverlayTitle>
                <div className="flex flex-col">
                  <Link
                    href={newOrderingHref('created_at')}
                    className={cn(buttonVariants({ variant: 'ghost', className: 'w-full justify-start' }))}
                  >
                    {t('advancedEntrySearch:orderByChronological')}
                  </Link>
                  <Link
                    href={newOrderingHref('-like_count')}
                    className={cn(buttonVariants({ variant: 'ghost', className: 'w-full justify-start' }))}
                  >
                    {t('advancedEntrySearch:orderByLikes')}
                  </Link>
                  <Link
                    href={newOrderingHref('-dislike_count')}
                    className={cn(buttonVariants({ variant: 'ghost', className: 'w-full justify-start' }))}
                  >
                    {t('advancedEntrySearch:orderByDislikes')}
                  </Link>
                  <Link
                    href={newOrderingHref('-bookmark_count')}
                    className={cn(buttonVariants({ variant: 'ghost', className: 'w-full justify-start' }))}
                  >
                    {t('advancedEntrySearch:orderByBookmarks')}
                  </Link>
                </div>
              </OverlayContent>
            </Overlay>
            <Overlay breakpoint="md">
              <OverlayTrigger>
                <Button variant="ghost" className="px-0 hover:bg-transparent">
                  <p className="font-medium text-primary hover:underline">
                    {t('common:search')}:{searchParams.created_at__gte ? ` ${searchParams.created_at__gte}` : ''}
                    {searchParams.created_at__lte ? ` ${searchParams.created_at__lte}` : ''}
                    {searchParams.author ? ` ${searchParams.author}` : ''}
                  </p>
                </Button>
              </OverlayTrigger>
              <OverlayContent align="start" side="bottom" className="w-full">
                <form id="entrySearchForm" action={`/titles/${title.slug}`}>
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
                            <SingleDateInput
                              form="entrySearchForm"
                              name="created_at__gte"
                              placeholder={t('advancedEntrySearch:pickADate')}
                              value={optionalDate(searchParams.created_at__gte)}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="toDate">{t('advancedEntrySearch:toDate')}</Label>
                            <SingleDateInput
                              form="entrySearchForm"
                              name="created_at__lte"
                              placeholder={t('advancedEntrySearch:pickADate')}
                              value={optionalDate(searchParams.created_at__lte)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 py-2">
                        <Label htmlFor="from">{t('advancedEntrySearch:from')}</Label>
                        <Input
                          form="entrySearchForm"
                          id="author"
                          name="author"
                          value={searchParams.author}
                          placeholder={t('advancedEntrySearch:enterUserID')}
                        />
                      </div>
                      <Button type="submit">{t('common:search')}</Button>
                    </div>
                  </div>
                  <Input type="hidden" name="ordering" value={searchParams.ordering} />
                </form>
              </OverlayContent>
            </Overlay>
            <FollowButton title={title} />
          </div>
          <Paginator
            queryParams={searchParams}
            pathname={`/titles/${title.slug}`}
            currentPage={searchParams.page || 1}
            totalPages={entries?.total_pages || 1}
            className="mt-1"
          />
        </div>
        <div className="mt-2 px-6">
          <Separator />
        </div>
      </div>
      {entries &&
        ((entries.results.length || 0) > 0 ? (
          entries.results.map((entry) => (
            <Entry
              key={entry.id}
              id={entry.id}
              entry={includesType(includesType({ ...entry }, 'author', 'User'), 'title', 'Title')}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 p-10">{t('title:noEntryFound')}</div>
        ))}
      <div className="p-2 w-full">
        <NewEntryEditor title={title} />
      </div>
    </>
  )
}
