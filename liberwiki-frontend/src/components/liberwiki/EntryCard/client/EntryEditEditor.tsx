'use client'

import { useRouter } from 'next/navigation'

import Editor from '@/components/liberwiki/Editor'

import { APIType, Includes } from '@/api'
import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'
import { uuidV4toHEX } from '@/lib/utils'

import { toast } from 'sonner'

export default function EntryEditEditor({
  entry,
}: {
  entry: Includes<Includes<APIType<'Entry'>, 'author', APIType<'User'>>, 'title', APIType<'Title'>>
}) {
  const router = useRouter()
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['entry'])

  async function handleEditorSubmit(content: object) {
    const { response: createEntryResponse } = await liberwiki.patchEntry(entry.id, { content })
    if (createEntryResponse.ok) {
      router.push(`/entries/${uuidV4toHEX(entry.id)}`)
    } else {
      toast(t('entry:entryEditError'))
    }
  }

  return <Editor readonly={false} onSubmit={handleEditorSubmit} content={entry.content as object} />
}
