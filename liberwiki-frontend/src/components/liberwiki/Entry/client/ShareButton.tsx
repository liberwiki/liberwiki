'use client'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'

import { APIType, Includes } from '@/api/typeHelpers'
import { useClientTranslation } from '@/i18n'
import { uuidV4toHEX } from '@/lib/utils'

import { toast } from 'sonner'

export default function ShareButton({
  entry,
}: {
  entry: Includes<Includes<APIType<'Entry'>, 'author', APIType<'User'>>, 'title', APIType<'Title'>>
}) {
  const { t } = useClientTranslation(['entry'])

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/entries/${uuidV4toHEX(entry.id)}`)
    toast(t('entry:linkCopiedToClipboard', { entryId: entry.id }))
  }

  return (
    <Button variant="ghost" size="icon" onClick={copyLink}>
      <Icons.Share2 className="h-4 w-4" />
    </Button>
  )
}
