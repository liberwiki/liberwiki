'use client'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import AuthenticatedOnlyActionButton from '@/components/liberwiki/AuthenticatedOnlyActionButton'

import { APIType, Includes } from '@/api/typeHelpers'
import { useLiberWikiAPI } from '@/lib/serverHooks'
import { cn } from '@/lib/utils'

export default function BookmarkButton({
  entry,
  isAuthenticated,
}: {
  entry: Includes<Includes<APIType<'Entry'>, 'author', APIType<'User'>>, 'title', APIType<'Title'>>
  isAuthenticated: boolean
}) {
  const liberwiki = useLiberWikiAPI()
  const [isBookmarked, setIsBookmarked] = useState<boolean>(entry.is_bookmarked)

  async function handleBookmark() {
    setIsBookmarked(!isBookmarked)
    const lw = liberwiki
    await (isBookmarked ? lw.unbookmarkEntry.bind(lw) : lw.bookmarkEntry.bind(lw))(entry.id)
  }

  return (
    <AuthenticatedOnlyActionButton
      variant="ghost"
      size="icon"
      onClick={handleBookmark}
      isAuthenticated={isAuthenticated}
    >
      <Icons.Heart className={cn('h-4 w-4', isBookmarked && 'fill-primary')} />
    </AuthenticatedOnlyActionButton>
  )
}
