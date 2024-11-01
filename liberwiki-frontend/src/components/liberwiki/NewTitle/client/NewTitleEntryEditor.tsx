'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import Editor from '@/components/liberwiki/Editor'

import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function NewTitleEntryEditor(
  props: Omit<React.ComponentPropsWithoutRef<typeof Editor>, 'onSubmit' | 'readonly'> & { newTitle: string }
) {
  const { newTitle, ...editorProps } = props
  const liberwiki = useLiberWikiAPI()
  const router = useRouter()
  const { t } = useClientTranslation(['title', 'entry'])

  async function handleEditorSubmit(content: object) {
    const { data: title, response: createTitleResponse } = await liberwiki.createTitle({ name: newTitle })
    const { response: createEntryResponse } = await liberwiki.createEntry({ title: title?.id as string, content })
    if (createTitleResponse.ok && createEntryResponse.ok) {
      toast(t('entry:yourEntryHasBeenCreated'))
    } else {
      toast(t('entry:entryCreationError'))
    }
    router.push(`/titles/${title?.slug}`)
  }

  return <Editor readonly={false} onSubmit={handleEditorSubmit} {...editorProps} />
}
