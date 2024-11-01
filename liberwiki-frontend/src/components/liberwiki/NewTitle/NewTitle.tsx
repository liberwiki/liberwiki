import Link from 'next/link'

import { NewTitleEntryEditor } from '@/components/liberwiki/NewTitle/client'
import { Separator } from '@/components/shadcn/separator'

import { sUseTranslation } from '@/i18n'

export async function NewTitle({ newTitle }: { newTitle: string }) {
  const { t } = await sUseTranslation(['title', 'entry'])

  return (
    <>
      <div className="w-full">
        <Link className="h-1 p-6 text-xl font-bold" href={{ pathname: `/titles/${newTitle}` }}>
          {newTitle}
        </Link>
        <div className="mt-2 px-4">
          <Separator />
        </div>
      </div>
      <div className="text-center text-gray-500 p-10">{t('title:noEntryFound')}</div>
      <div className="p-2 w-full">
        <NewTitleEntryEditor newTitle={decodeURI(newTitle)} />
      </div>
    </>
  )
}
