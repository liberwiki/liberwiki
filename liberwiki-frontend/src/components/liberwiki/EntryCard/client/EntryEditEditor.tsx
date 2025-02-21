'use client'

import { useRouter } from 'next/navigation'

import Editor from '@/components/liberwiki/Editor'

import { APIType, Includes } from '@/api'
import { useClientTranslation } from '@/i18n'
import { APIErrorToast } from '@/lib/liberwikiAPIUtils'
import { useLiberWikiAPI } from '@/lib/serverHooks'
import { uuidV4toHEX } from '@/lib/utils'

export default function EntryEditEditor({
  entry,
}: {
  entry: Includes<Includes<APIType<'Entry'>, 'author', APIType<'User'>>, 'title', APIType<'Title'>>
}) {
  const router = useRouter()
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['entry'])

  async function handleEditorSubmit(content: object, isDraft: boolean = false) {
    const { response: editEntryResponse, error: editEntryError } = await liberwiki.patchEntry(entry.id, {
      content,
      is_draft: isDraft,
    })
    if (editEntryResponse.ok) {
      router.push(`/entries/${uuidV4toHEX(entry.id)}`)
    } else {
      APIErrorToast(editEntryError, t('entry:entryEditError'))
    }
  }

  return <Editor readonly={false} onSubmit={handleEditorSubmit} content={entry.content as object} draftable={false} />
}
