import Link from 'next/link'

import * as Icons from 'lucide-react'

import Editor from '@/components/liberwiki/Editor'
import { BookmarkButton, DeleteButton, FeedbackButtons } from '@/components/liberwiki/Entry/client'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { Overlay, OverlayClose, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'

import { APIType, Includes } from '@/api/typeHelpers'
import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'
import { shortFormattedDate } from '@/lib/utils'

export async function Entry({
  id,
  entry,
}: {
  id: string
  entry: Includes<Includes<APIType<'Entry'>, 'author', APIType<'User'>>, 'title', APIType<'Title'>>
}) {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['entry'])
  const { data: user } = await liberwiki.me()

  return (
    <Card className="w-full border-0" id={id}>
      <CardContent className="pt-6">
        <div className="text-lg mb-4 overflow-x-auto">
          <Editor readonly={true} content={entry.content as object} />
        </div>
        <div className="flex justify-between items-center -mx-4">
          <div className="flex gap-2 items-center">
            <FeedbackButtons entry={entry} />
            <BookmarkButton entry={entry} />
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
              <span>{shortFormattedDate(new Date(entry.created_at))}</span>
            </div>
            <Overlay breakpoint="md">
              <OverlayTrigger>
                <Button variant="ghost" size="icon">
                  <Icons.MoreHorizontal className="h-4 w-4" />
                </Button>
              </OverlayTrigger>
              {(user?.id === entry.author.id || user?.is_superuser) && (
                // When we add new actions other than delete, we should check all of them unless
                // there are actions that can be done without being the owner of the entry.
                // Right now it doesn't make sense to have this button at all if the user is not the owner.
                <OverlayContent side="bottom" align="end" asChild>
                  <div className="flex flex-col gap-2">
                    {(user?.id === entry.author.id || user?.is_superuser) && (
                      <OverlayClose>
                        <DeleteButton variant="ghost" className="w-full justify-start" entry={entry}>
                          {t('entry:delete')}
                        </DeleteButton>
                      </OverlayClose>
                    )}
                  </div>
                </OverlayContent>
              )}
            </Overlay>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
