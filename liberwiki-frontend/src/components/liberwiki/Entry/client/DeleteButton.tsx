'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import { Button } from '@/components/shadcn/button'

import { APIType, Includes } from '@/api/typeHelpers'
import config from '@/config'
import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function DeleteButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & {
    entry: Includes<Includes<APIType<'Entry'>, 'author', APIType<'User'>>, 'title', APIType<'Title'>>
  }
) {
  const { entry, children, ...buttonProps } = props
  const liberwiki = useLiberWikiAPI()
  const router = useRouter()
  const { t } = useClientTranslation(['common', 'entry'])

  async function handleDelete() {
    const { response } = await liberwiki.deleteEntry(entry.id)
    if (response.ok) {
      if (entry.title.entry_count === 1) {
        toast(t('entry:entryHasBenDeleted', { entryId: entry.id }))
        router.push(`/titles/${entry.title.name}`)
        router.refresh()
      } else {
        const targetPage = Math.max(1, Math.ceil((entry.title.entry_count - 1) / config.ux.defaultEntryPageSize))
        router.push(`/titles/${entry.title.slug}/?${new URLSearchParams({ page: String(targetPage) }).toString()}`)
        router.refresh()
      }
    } else {
      toast(t('common:somethingWentWrong', { entryId: entry.id }))
    }
  }

  return (
    <Button onClick={handleDelete} {...buttonProps}>
      {children}
    </Button>
  )
}
