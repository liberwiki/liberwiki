import Link from 'next/link'

import { NewTitleEntryEditor } from '@/components/liberwiki/NewTitle/client'
import { Separator } from '@/components/shadcn/separator'

import { sUseTranslation } from '@/i18n'

export async function NewTitle({ newTitle }: { newTitle: string }) {
  const { t } = await sUseTranslation(['title', 'entry'])
  const title = decodeURIComponent(newTitle)

  return (
    <>
      <div className="w-full">
        <Link
          prefetch={true}
          className="h-1 p-6 text-xl font-bold break-words"
          href={{ pathname: `/titles/${newTitle}` }}
        >
          {title}
        </Link>
        <div className="mt-2 px-4">
          <Separator />
        </div>
      </div>
      <div className="text-center text-gray-500 p-10">{t('title:noEntryFound')}</div>
      <div className="p-2 w-full">
        <NewTitleEntryEditor newTitle={title} />
      </div>
    </>
  )
}
