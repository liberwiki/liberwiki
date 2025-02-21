'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import _ from 'lodash'

import Editor from '@/components/liberwiki/Editor'

import { APIType } from '@/api'
import config from '@/config'
import { useClientTranslation } from '@/i18n'
import { APIErrorToast } from '@/lib/liberwikiAPIUtils'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function NewEntryEditor(
  props: Omit<React.ComponentPropsWithoutRef<typeof Editor>, 'onSubmit' | 'readonly'> & { title: APIType<'Title'> }
) {
  const { title, ...editorProps } = props
  const router = useRouter()
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['entry'])

  async function handleEditorSubmit(content: object, isDraft = false) {
    const { data: entries } = await liberwiki.entries({ is_draft: true, title: title.id })
    const draftEntry = _.first(entries?.results)
    const entryData = {
      content,
      is_draft: isDraft,
      title: title?.id as string,
    }
    let entryRawResponse

    if (isDraft) {
      if (draftEntry) {
        entryRawResponse = await liberwiki.patchEntry(draftEntry.id, entryData)
      } else {
        entryRawResponse = await liberwiki.createEntry(entryData)
      }
      const entryResponse = entryRawResponse.response
      const createEntryError = entryRawResponse.error
      if (entryResponse.ok) {
        toast(t('entry:yourDraftEntryHasBeenCreated'))
      } else {
        APIErrorToast(createEntryError, t('entry:entryCreationError'))
      }
    } else {
      if (draftEntry) {
        entryRawResponse = await liberwiki.patchEntry(draftEntry.id, entryData)
      } else {
        entryRawResponse = await liberwiki.createEntry(entryData)
      }
      const entryResponse = entryRawResponse.response
      const createEntryError = entryRawResponse.error
      if (entryResponse.ok) {
        toast(t('entry:yourEntryHasBeenCreated'))
        const [tet, epp] = [title.entry_count + 1, config.ux.defaultEntryPageSize]
        const targetPage = tet % epp === 0 ? tet / epp : Math.floor(tet / epp) + 1
        const targetUrl = `/titles/${title.slug}/?${new URLSearchParams({ page: String(targetPage) }).toString()}`
        router.push(targetUrl, { scroll: true })
        router.refresh()
      } else {
        APIErrorToast(createEntryError, t('entry:entryCreationError'))
      }
    }
  }

  async function handleOnEditorDismiss() {
    const { data: entries } = await liberwiki.entries({ is_draft: true, title: title.id })
    const draftEntry = _.first(entries?.results)
    if (draftEntry) {
      const { response: entryResponse } = await liberwiki.deleteEntry(draftEntry.id)
      if (entryResponse.ok) {
        toast(t('entry:yourDraftEntryHasBeenDeleted', { entryId: draftEntry.id }))
      } else {
        toast(t('common:somethingWentWrong'))
      }
    }
    router.refresh()
  }

  return (
    <Editor
      readonly={false}
      onSubmit={handleEditorSubmit}
      onDismiss={handleOnEditorDismiss}
      {...editorProps}
      draftable
    />
  )
}
