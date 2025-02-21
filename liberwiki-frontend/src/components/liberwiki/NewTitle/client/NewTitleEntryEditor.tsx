'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import _ from 'lodash'

import Editor from '@/components/liberwiki/Editor'

import { useClientTranslation } from '@/i18n'
import { APIErrorToast } from '@/lib/liberwikiAPIUtils'
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
      const {
        data: createdTitle,
        error: createTitleError,
        response: createTitleResponse,
      } = await liberwiki.createTitle({ name: newTitle })
      if (createTitleResponse.ok) {
        return createdTitle
      } else {
        APIErrorToast(createTitleError, t('entry:titleCreationError'))
      }
    }
  }

  async function handleEditorSubmit(content: object, isDraft: boolean = false) {
    const title = await getTitle()
    if (title) {
      const { response: createEntryResponse, error: createEntryError } = await liberwiki.createEntry({
        title: title?.id as string,
        content,
        is_draft: isDraft,
      })
      if (createEntryResponse.ok) {
        toast(t('entry:yourEntryHasBeenCreated'))
        router.push(`/titles/${title?.slug}`)
        router.refresh()
      } else {
        APIErrorToast(createEntryError, t('entry:entryCreationError'))
      }
    }
  }

  return <Editor readonly={false} onSubmit={handleEditorSubmit} {...editorProps} draftable />
}
