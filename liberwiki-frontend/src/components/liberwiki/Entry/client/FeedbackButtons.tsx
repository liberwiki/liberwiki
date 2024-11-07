'use client'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'

import { APIType, Includes } from '@/api/typeHelpers'
import { useLiberWikiAPI } from '@/lib/serverHooks'
import { cn } from '@/lib/utils'

export default function FeedbackButtons({
  entry,
}: {
  entry: Includes<Includes<APIType<'Entry'>, 'author', APIType<'User'>>, 'title', APIType<'Title'>>
}) {
  const liberwiki = useLiberWikiAPI()
  const [feedback, setFeedback] = useState<APIType<'VoteEnum'> | null>(entry.vote)

  function handleVote(vote: APIType<'VoteEnum'>) {
    return async function () {
      if (feedback === vote) {
        setFeedback(null)
        await liberwiki.unvoteEntry(entry.id)
      } else {
        setFeedback(vote)
        await _.get(
          {
            UPVOTE: liberwiki.upvoteEntry.bind(liberwiki),
            DOWNVOTE: liberwiki.downvoteEntry.bind(liberwiki),
          },
          vote
        )(entry.id)
      }
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleVote('UPVOTE')}>
        <Icons.ArrowBigUp className={cn('h-5 w-5', feedback === 'UPVOTE' && 'fill-green-500 text-green-500')} />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleVote('DOWNVOTE')}>
        <Icons.ArrowBigDown className={cn('h-5 w-5', feedback === 'DOWNVOTE' && 'fill-destructive text-destructive')} />
      </Button>
    </>
  )
}
