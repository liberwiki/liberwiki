import Link from 'next/link'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import Editor from '@/components/aciksozluk/Editor'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'

import { APIType, Includes } from '@/api/typeHelpers'
import { useAcikSozlukAPI } from '@/lib/serverHooks'
import { cn } from '@/lib/utils'

import { format } from 'date-fns'
import { toast } from 'sonner'

export function Entry({
  entry,
  onDelete = () => {},
}: {
  entry: Includes<APIType<'Entry'>, 'author', APIType<'User'>>
  onDelete?: () => void
}) {
  const aciksozluk = useAcikSozlukAPI()
  const queryClient = aciksozluk.useQueryClient()
  const { mutateAsync: deleteEntry } = aciksozluk.deleteEntry(entry.id)
  const { mutateAsync: upvoteEntry } = aciksozluk.upvoteEntry(entry.id)
  const { mutateAsync: downvoteEntry } = aciksozluk.downvoteEntry(entry.id)
  const { mutateAsync: unvoteEntry } = aciksozluk.unvoteEntry(entry.id)
  const { mutateAsync: bookmarkEntry } = aciksozluk.bookmark(entry.id)
  const { mutateAsync: unBookmarkEntry } = aciksozluk.unBookmark(entry.id)

  const [feedback, setFeedback] = useState<APIType<'VoteEnum'> | null>(entry.vote)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(entry.is_bookmarked)

  async function handleBookmark() {
    setIsBookmarked(!isBookmarked)
    await (isBookmarked ? unBookmarkEntry() : bookmarkEntry())
  }

  function handleVote(vote: APIType<'VoteEnum'>) {
    return async function () {
      if (feedback === vote) {
        setFeedback(null)
        await unvoteEntry()
      } else {
        setFeedback(vote)
        await _.get({ UPVOTE: upvoteEntry, DOWNVOTE: downvoteEntry }, vote)()
      }
    }
  }

  async function handleDelete() {
    await deleteEntry()
    await queryClient.invalidateQueries({ queryKey: ['titles'] })
    await queryClient.invalidateQueries({ queryKey: ['entries'] })
    onDelete()
    toast('Your entry has been deleted.', { description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' hh:mm a") })
  }

  return (
    <Card className="w-full mx-auto border-0 my-2">
      <CardContent className="pt-6">
        <div className="text-lg mb-4">
          <Editor readonly={true} content={entry.content as object} />
        </div>
        <div className="flex justify-between items-center -mx-4">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVote('UPVOTE')}
              className={feedback === 'UPVOTE' ? 'text-green-500' : ''}
            >
              <Icons.ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVote('DOWNVOTE')}
              className={feedback === 'DOWNVOTE' ? 'text-red-500' : ''}
            >
              <Icons.ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleBookmark}>
              <Icons.Heart className={cn('h-4 w-4', isBookmarked && 'fill-white')} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icons.Share2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="text-sm text-gray-500">
              <Link href={{ pathname: '/' }} className="font-medium text-primary hover:underline">
                {entry.author.username}
              </Link>
              <span className="mx-1">•</span>
              <span>{format(new Date(entry.created_at), 'dd.MM.yyyy')}</span>
            </div>
            <Overlay breakpoint="md">
              <OverlayTrigger>
                <Button variant="ghost" size="icon">
                  <Icons.MoreHorizontal className="h-4 w-4" />
                </Button>
              </OverlayTrigger>
              <OverlayContent side="bottom" align="end">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" disabled>
                    Edit
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleDelete}>
                    Delete
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" disabled>
                    Report
                  </Button>
                </div>
              </OverlayContent>
            </Overlay>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
