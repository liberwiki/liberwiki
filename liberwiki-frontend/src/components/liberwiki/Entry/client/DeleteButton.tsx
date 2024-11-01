'use client'

import React from 'react'

import { Button } from '@/components/shadcn/button'

import { APIType, Includes } from '@/api/typeHelpers'
import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function DeleteButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & {
    entry: Includes<APIType<'Entry'>, 'author', APIType<'User'>>
  }
) {
  const { entry, children, ...buttonProps } = props
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['common', 'entry'])

  async function handleDelete() {
    await liberwiki.deleteEntry(entry.id)
    toast(t('entry:entryHasBenDeleted', { entryId: entry.id }))
  }

  return (
    <Button onClick={handleDelete} {...buttonProps}>
      {children}
    </Button>
  )
}
