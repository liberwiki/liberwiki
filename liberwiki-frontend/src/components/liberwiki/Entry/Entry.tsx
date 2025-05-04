import Link from 'next/link'

import * as Icons from 'lucide-react'

import { EditorHTMLContent } from '@/components/liberwiki/Editor/Editor'
import { BookmarkButton, DeleteButton, FeedbackButtons, ShareButton } from '@/components/liberwiki/Entry/client'
import { Button, buttonVariants } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { Overlay, OverlayClose, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'

import { APIType, Includes } from '@/api/typeHelpers'
import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'
import { cn, shortFormattedDate, uuidV4toHEX } from '@/lib/utils'

export async function Entry({
  entry,
  classNames,
  isAuthenticated = false,
}: {
  entry: Includes<Includes<APIType<'Entry'>, 'author', APIType<'User'>>, 'title', APIType<'Title'>>
  classNames?: Partial<Record<'Card' | 'CardContent', string>>
  isAuthenticated?: boolean
}) {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['entry'])
  const { data: user } = await liberwiki.me()

  return (
    <Card className={cn('w-full border-0 shadow-none', classNames?.Card)} id={entry.id}>
      <CardContent className={cn('pt-6 flex flex-col gap-2', classNames?.CardContent)}>
        <div className="overflow-x-auto [&_p:has(br.ProseMirror-trailingBreak)]:hidden">
          <EditorHTMLContent content={entry.content as object} />
        </div>
        <div className="flex justify-between items-center -mx-4">
          <div className="flex gap-2 max-sm:gap-0 items-center">
            <FeedbackButtons entry={entry} isAuthenticated={isAuthenticated} />
            <BookmarkButton entry={entry} isAuthenticated={isAuthenticated} />
            <ShareButton entry={entry} />
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-sm text-gray-500 max-sm:flex max-sm:flex-col max-sm:items-end">
              <Link prefetch={true} href={{ pathname: '/' }} className="font-medium text-primary hover:underline">
                {entry.author.username}
              </Link>
              <span className="mx-1 max-sm:hidden">•</span>
              <span className="max-sm:text-xs">{shortFormattedDate(new Date(entry.created_at))}</span>
            </div>
            <Overlay breakpoint="md">
              <OverlayTrigger>
                <Button variant="ghost" size="icon">
                  <Icons.MoreHorizontal className="h-4 w-4" />
                </Button>
              </OverlayTrigger>
              <OverlayContent side="bottom" align="end">
                <div className="flex flex-col items-start gap-2">
                  {(user?.id === entry.author.id || user?.is_superuser) && (
                    <OverlayClose className="w-full">
                      <DeleteButton variant="ghost" className="w-full justify-start" entry={entry}>
                        {t('entry:delete')}
                      </DeleteButton>
                    </OverlayClose>
                  )}
                  {user?.id === entry.author.id && (
                    <OverlayClose className="w-full">
                      <Link
                        prefetch={true}
                        href={{ pathname: `/entries/${uuidV4toHEX(entry.id)}/edit` }}
                        className={cn(buttonVariants({ variant: 'ghost', className: 'justify-start w-full' }))}
                      >
                        {t('entry:edit')}
                      </Link>
                    </OverlayClose>
                  )}
                  <OverlayClose className="w-full">
                    <Link
                      prefetch={true}
                      href={{ pathname: `/entries/${uuidV4toHEX(entry.id)}` }}
                      className={cn(buttonVariants({ variant: 'ghost', className: 'justify-start w-full' }))}
                    >
                      {t('entry:goToEntry')}
                    </Link>
                  </OverlayClose>
                </div>
              </OverlayContent>
            </Overlay>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
