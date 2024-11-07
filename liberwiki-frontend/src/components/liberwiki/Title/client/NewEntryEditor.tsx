'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import Editor from '@/components/liberwiki/Editor'

import { APIType } from '@/api'
import config from '@/config'
import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function NewEntryEditor(
  props: Omit<React.ComponentPropsWithoutRef<typeof Editor>, 'onSubmit' | 'readonly'> & { title: APIType<'Title'> }
) {
  const { title, ...editorProps } = props
  const router = useRouter()
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['entry'])

  async function handleEditorSubmit(content: object) {
    const { response: createEntryResponse } = await liberwiki.createEntry({ title: title?.id as string, content })
    if (createEntryResponse.ok) {
      toast(t('entry:yourEntryHasBeenCreated'))
      const [tet, epp] = [title.entry_count + 1, config.ux.defaultEntryPageSize]
      const targetPage = tet % epp === 0 ? tet / epp : Math.floor(tet / epp) + 1
      router.push(`?${new URLSearchParams({ page: String(targetPage) }).toString()}`)
    } else {
      toast(t('entry:entryCreationError'))
    }
  }

  return <Editor readonly={false} onSubmit={handleEditorSubmit} {...editorProps} />
}
