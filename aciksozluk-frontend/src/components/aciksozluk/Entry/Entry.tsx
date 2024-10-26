import Link from 'next/link'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import Editor from '@/components/aciksozluk/Editor'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'

import { APIType, Includes } from '@/api/typeHelpers'
import { useClientTranslation } from '@/i18n'
import { useAcikSozlukAPI } from '@/lib/serverHooks'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/authProvider'

import { format } from 'date-fns'
import { toast } from 'sonner'

export function Entry({
  entry,
  onDelete = () => {},
}: {
  entry: Includes<APIType<'Entry'>, 'author', APIType<'User'>>
  onDelete?: () => void
}) {
  const { user } = useAuth()
  const aciksozluk = useAcikSozlukAPI()
  const queryClient = aciksozluk.useQueryClient()

  const { t } = useClientTranslation(['common', 'entry'])

  const { mutateAsync: deleteEntry } = aciksozluk.deleteEntry(entry.id)
  const { mutateAsync: upvoteEntry } = aciksozluk.upvoteEntry(entry.id)
  const { mutateAsync: downvoteEntry } = aciksozluk.downvoteEntry(entry.id)
  const { mutateAsync: unvoteEntry } = aciksozluk.unvoteEntry(entry.id)
  const { mutateAsync: bookmarkEntry } = aciksozluk.bookmarkEntry(entry.id)
  const { mutateAsync: unbookmarkEntry } = aciksozluk.unbookmarkEntry(entry.id)

  const [feedback, setFeedback] = useState<APIType<'VoteEnum'> | null>(entry.vote)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(entry.is_bookmarked)

  async function handleBookmark() {
    setIsBookmarked(!isBookmarked)
    await (isBookmarked ? unbookmarkEntry() : bookmarkEntry())
    await queryClient.invalidateQueries({ queryKey: ['entries'] })
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
      await queryClient.invalidateQueries({ queryKey: ['entries'] })
    }
  }

  async function handleDelete() {
    await deleteEntry()
    await queryClient.invalidateQueries({ queryKey: ['titles'] })
    await queryClient.invalidateQueries({ queryKey: ['entries'] })
    onDelete()
    toast(t('entry:entryHasBenDeleted', { entryId: entry.id }))
  }
  return (
    <Card className="w-full border-0">
      <CardContent className="pt-6">
        <div className="text-lg mb-4 overflow-x-auto">
          <Editor readonly={true} content={entry.content as object} />
        </div>
        <div className="flex justify-between items-center -mx-4">
          <div className="flex gap-2 items-center">
            <Button variant="ghost" size="icon" onClick={handleVote('UPVOTE')}>
              <Icons.ArrowBigUp className={cn('h-5 w-5', feedback === 'UPVOTE' && 'fill-green-500 text-green-500')} />
            </Button>
            <small>{entry.like_count}</small>
            <small>{entry.dislike_count}</small>
            <Button variant="ghost" size="icon" onClick={handleVote('DOWNVOTE')}>
              <Icons.ArrowBigDown
                className={cn('h-5 w-5', feedback === 'DOWNVOTE' && 'fill-destructive text-destructive')}
              />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleBookmark}>
              <Icons.Heart className={cn('h-4 w-4', isBookmarked && 'fill-primary')} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icons.Share2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 items-center">
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
                <div className="flex flex-col gap-2">
                  {(user?.id === entry.author.id || user?.is_superuser) && (
                    <Button variant="ghost" className="w-full justify-start" onClick={handleDelete}>
                      {t('entry:delete')}
                    </Button>
                  )}
                </div>
              </OverlayContent>
            </Overlay>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
