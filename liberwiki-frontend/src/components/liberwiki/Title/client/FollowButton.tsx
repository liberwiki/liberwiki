'use client'

import { useState } from 'react'

import { Button } from '@/components/shadcn/button'

import { APIType } from '@/api'
import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

export default function FollowButton({ title }: { title: APIType<'Title'> }) {
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['title'])
  const [isBookmarked, setIsBookmarked] = useState<boolean>(title.is_bookmarked)

  async function handleBookmark() {
    setIsBookmarked(!isBookmarked)
    const handler = isBookmarked ? liberwiki.unbookmarkTitle.bind(liberwiki) : liberwiki.bookmarkTitle.bind(liberwiki)
    await handler(title.id)
  }

  return (
    <Button onClick={handleBookmark} variant="ghost" className="px-0 hover:bg-transparent">
      <p className="font-medium text-primary hover:underline">
        {isBookmarked ? t('title:unfollow') : t('title:follow')}
      </p>
    </Button>
  )
}
