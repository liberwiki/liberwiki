'use client'

import Link from 'next/link'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import Editor from '@/components/aciksozluk/Editor'
import Entry from '@/components/aciksozluk/Entry'
import Paginator from '@/components/aciksozluk/Paginator'
import { Button } from '@/components/shadcn/button'
import { Calendar } from '@/components/shadcn/calendar'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Separator } from '@/components/shadcn/separator'

import { APIType, includesType } from '@/api'
import config from '@/config'
import { useFormState } from '@/lib/hooks'
import { useAcikSozlukAPI } from '@/lib/serverHooks'

import { format } from 'date-fns'
import { toast } from 'sonner'

export function Title({ title }: { title: APIType<'Title'> }) {
  const entryPerPage = config.ux.defaultEntryPageSize
  const aciksozluk = useAcikSozlukAPI()

  const [currentPage, setCurrentPage] = useState<number>(1)

  const queryClient = aciksozluk.useQueryClient()
  const { mutateAsync: createEntry } = aciksozluk.createEntry()

  const {
    formState: searchState,
    handleFormStateValue: handleSearchStateValue,
    handleFormStateEvent: handleSearchStateEvent,
  } = useFormState<{
    textSearch: string
    mine: boolean
    fromDate: Date | undefined
    toDate: Date | undefined
  }>({
    textSearch: '',
    mine: false,
    fromDate: undefined,
    toDate: undefined,
  })

  const { isSuccess, data: entries } = aciksozluk.entries({
    page: currentPage,
    title__slug: title.slug,
    page_size: entryPerPage,
    include: 'author',
  })

  async function handleEditorSubmit(content: object) {
    const { response: createEntryResponse } = await createEntry({ title: title?.id as string, content })
    if (createEntryResponse.ok) {
      toast('Your entry has been created.', { description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' hh:mm a") })
      await queryClient.invalidateQueries({ queryKey: ['titles'] })
      await queryClient.invalidateQueries({ queryKey: ['entries'] })
      if (entries) {
        // If the current page is full, and a new entry is created, go to the next page
        setCurrentPage(entries.count % entryPerPage === 0 ? entries.total_pages + 1 : entries.total_pages)
      }
    } else {
      toast('An error occurred while creating your entry. Please try again later.', {
        description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' hh:mm a"),
      })
    }
  }

  async function handleEntryDelete() {
    // I couldn't get this logic working without explicitly passing a function to the Entry component
    if (entries) {
      // If current page only has 1 entry, and it is deleted, go to the previous page
      setCurrentPage(entries.count % entryPerPage === 1 ? entries.total_pages - 1 : entries.total_pages)
    }
  }

  return (
    <>
      <div className="w-full">
        <Link className="h-1 p-6 text-xl font-bold" href={{ pathname: `/titles/${title.name}` }}>
          {title?.name}
        </Link>
        <div className="text-sm px-6 py-2 text-gray-500 flex justify-between items-center max-lg:flex-wrap">
          <div className="gap-6 flex w-full items-center">
            <Overlay breakpoint="md">
              <OverlayTrigger>
                <Button variant="ghost" className="px-0 hover:bg-transparent">
                  <p className="font-medium text-primary hover:underline">Order By: Best</p>
                </Button>
              </OverlayTrigger>
              <OverlayContent align="start" side="bottom">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Best
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Chronological
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Most Liked
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Most Disliked
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Most Commented
                  </Button>
                </div>
              </OverlayContent>
            </Overlay>
            <Overlay breakpoint="md">
              <OverlayTrigger>
                <Button variant="ghost" className="px-0 hover:bg-transparent">
                  <p className="font-medium text-primary hover:underline">Search</p>
                </Button>
              </OverlayTrigger>
              <OverlayContent align="start" side="bottom" className="w-full">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg leading-none">Advanced Entry Search</h4>
                    <p className="text-sm text-muted-foreground">Refine your search with additional filters.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fromDate">Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={'outline'}
                                className={`w-full justify-start text-left font-normal ${!searchState.fromDate && 'text-muted-foreground'}`}
                              >
                                {searchState.fromDate ? format(searchState.fromDate, 'PPP') : <span>Pick a date</span>}
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
                        <div className="space-y-2">
                          <Label htmlFor="toDate">End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={'outline'}
                                className={`w-full justify-start text-left font-normal ${!searchState.toDate && 'text-muted-foreground'}`}
                              >
                                {searchState.toDate ? format(searchState.toDate, 'PPP') : <span>Pick a date</span>}
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
                    <div className="space-y-2 flex flex-col gap-2">
                      <Label htmlFor="ketextSearch">Keywords</Label>
                      <Input
                        id="textSearch"
                        type="text"
                        name="textSearch"
                        placeholder="Enter keywords..."
                        value={searchState.textSearch}
                        onChange={handleSearchStateEvent('textSearch')}
                      />
                    </div>
                    <div className="flex items-center space-x-2 py-2">
                      <Checkbox
                        id="mine"
                        name="mine"
                        checked={searchState.mine}
                        onCheckedChange={handleSearchStateValue('mine')}
                      />
                      <Label htmlFor="mine">Mine</Label>
                    </div>
                    <Button type="submit" className="w-full">
                      <Icons.Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>
              </OverlayContent>
            </Overlay>
            <Button variant="ghost" className="px-0 hover:bg-transparent">
              <p className="font-medium text-primary hover:underline">Follow</p>
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
          <div className="text-center text-gray-500 p-10">
            No entries found. Be the first one to share your information.
          </div>
        ))}
      <Editor readonly={false} onSubmit={handleEditorSubmit} />
    </>
  )
}
