'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Editor from '@/components/liberwiki/Editor'
import { Separator } from '@/components/shadcn/separator'

import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export function NewTitle({ newTitle }: { newTitle: string }) {
  newTitle = decodeURI(newTitle)
  const liberwiki = useLiberWikiAPI()
  const queryClient = liberwiki.useQueryClient()
  const router = useRouter()

  const { t } = useClientTranslation(['title', 'entry'])

  const { mutateAsync: createTitle } = liberwiki.createTitle()
  const { mutateAsync: createEntry } = liberwiki.createEntry()

  async function handleEditorSubmit(content: object) {
    const { data: title, response: createTitleResponse } = await createTitle({ name: newTitle })
    const { response: createEntryResponse } = await createEntry({ title: title?.id as string, content })
    if (createTitleResponse.ok && createEntryResponse.ok) {
      toast(t('entry:yourEntryHasBeenCreated'))
    } else {
      toast(t('entry:entryCreationError'))
    }
    router.push(`/titles/${title?.slug}`)
    await queryClient.invalidateQueries()
  }

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
        <Editor readonly={false} onSubmit={handleEditorSubmit} />
      </div>
    </>
  )
}
