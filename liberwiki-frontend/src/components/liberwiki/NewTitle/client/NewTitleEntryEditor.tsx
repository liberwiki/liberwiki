'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import _ from 'lodash'

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

  async function getTitle() {
    const { data: title } = await liberwiki.titles({ name: newTitle, page_size: 1, page: 1 })
    const existingTitle = _.first(title?.results)
    if (existingTitle) {
      return existingTitle
    } else {
      const { data: createdTitle, error: titleError } = await liberwiki.createTitle({ name: newTitle })
      if (!titleError) {
        return createdTitle
      } else {
        toast(t('entry:titleCreationError'))
      }
    }
  }

  async function handleEditorSubmit(content: object) {
    const title = await getTitle()
    const { error: entryError } = await liberwiki.createEntry({ title: title?.id as string, content })
    if (!entryError) {
      toast(t('entry:yourEntryHasBeenCreated'))
      router.push(`/titles/${title?.slug}`)
      router.refresh()
    } else {
      toast(t('entry:entryCreationError'))
    }
  }

  return <Editor readonly={false} onSubmit={handleEditorSubmit} {...editorProps} />
}
