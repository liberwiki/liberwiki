'use client'

import Link from 'next/link'

import * as Icons from 'lucide-react'

import { Paginator } from '@/components/aciksozluk/Paginator/Paginator'
import { Button } from '@/components/shadcn/button'
import { Calendar } from '@/components/shadcn/calendar'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Separator } from '@/components/shadcn/separator'

import { useFormState } from '@/lib/hooks'

import { format } from 'date-fns'

export function Title() {
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

  return (
    <div>
      <Link className="h-1 p-6 text-xl font-bold" href="/">
        Python (Programming Language)
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
            <OverlayContent align="start" side="bottom">
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
                  <Input
                    id="textSearch"
                    type="text"
                    name="textSearch"
                    placeholder="Enter keywords..."
                    value={searchState.textSearch}
                    onChange={handleSearchStateEvent('textSearch')}
                  />
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
        <Paginator currentPage={1} totalPages={20} />
      </div>
      <div className="mt-2 px-6">
        <Separator />
      </div>
    </div>
  )
}
