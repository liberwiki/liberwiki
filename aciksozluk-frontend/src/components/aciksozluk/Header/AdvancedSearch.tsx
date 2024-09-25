'use client'

import * as Icons from 'lucide-react'

import { CheckedState } from '@radix-ui/react-checkbox'

import { Button } from '@/components/shadcn/button'
import { Calendar } from '@/components/shadcn/calendar'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'

import { useElementAttribute, useFormState } from '@/lib/hooks'
import { cn } from '@/lib/utils'

import { format } from 'date-fns'

export function AdvancedSearch() {
  const {
    // We are trying to keep the width of the popover the same as the search box
    // Proven too hard to do with only css/tailwind
    ref: searchBoxRef,
    attributeValue: popoverWidth,
  } = useElementAttribute<HTMLDivElement, keyof HTMLDivElement>('offsetWidth')

  const {
    formState: searchState,
    handleFormStateValue: handleSearchStateValue,
    handleFormStateEvent: handleSearchStateEvent,
  } = useFormState<{
    search: string
    textSearch: string
    fromAuthor: string
    fromDate: Date | undefined
    toDate: Date | undefined
    mine: CheckedState
    fav: CheckedState
  }>({
    search: '',
    textSearch: '',
    fromAuthor: '',
    fromDate: undefined,
    toDate: undefined,
    mine: false,
    fav: false,
  })

  function handleSearch() {
    console.log(searchState)
  }

  return (
    <>
      <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
        <div className="relative" ref={searchBoxRef}>
          <Input
            type="text"
            name="search"
            placeholder="Search..."
            className="pr-20 h-10"
            value={searchState.search}
            onChange={handleSearchStateEvent('search')}
          />
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
                  className: 'p-6 parent-adjust-advanced-search',
                  style: { width: `${popoverWidth}px` },
                }}
                sideOffset={8}
                side="bottom"
              >
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg leading-none">Advanced Title Search</h4>
                    <p className="text-sm text-muted-foreground">Refine your search with additional filters.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="freeText">Free Text Search</Label>
                      <Input
                        id="freeText"
                        type="text"
                        name="freeText"
                        placeholder="Enter keywords..."
                        value={searchState.textSearch}
                        onChange={handleSearchStateEvent('textSearch')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromAuthor">Author</Label>
                      <Select value={searchState.fromAuthor} onValueChange={handleSearchStateValue('fromAuthor')}>
                        <SelectTrigger id="fromAuthor">
                          <SelectValue placeholder="All Authors" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* @ts-expect-error TS2322 SelectItem doesn't accept null as a value */}
                          <SelectItem value={null}>All Authors</SelectItem>
                          <SelectItem value="1">isik-kaplan</SelectItem>
                          <SelectItem value="2">stubborn-physicist</SelectItem>
                          <SelectItem value="3">bad-surgeon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fromDate">From Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
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
                          <Label htmlFor="toDate">To Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  searchState.toDate && 'text-muted-foreground'
                                )}
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
                    <div className="space-y-2">
                      <div className="flex flex-col justify-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="mine"
                            name="mine"
                            checked={searchState.mine}
                            onCheckedChange={handleSearchStateValue('mine')}
                          />
                          <Label htmlFor="mine">Mine</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="fav"
                            name="fav"
                            checked={searchState.fav}
                            onCheckedChange={handleSearchStateValue('fav')}
                          />
                          <Label htmlFor="fav">From My Favorites</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Icons.Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </OverlayContent>
            </Overlay>
            <Button type="submit" variant="ghost" size="icon" className="h-full px-2 hover:bg-transparent">
              <Icons.Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
      {/* TODO: This really grinds my gears, but I can't find a better way to do this */}
      {/* Ideally we should use some tailwind magic to handle these cases */}
      <style jsx global>{`
        div:has(> .parent-adjust-advanced-search) {
          left: 52px !important;
        }

        @media (max-width: 768px) {
          div:has(> .parent-adjust-advanced-search) {
            left: 48px !important;
            transform: translate(0, 52px) !important;
          }
        }
      `}</style>
    </>
  )
}
