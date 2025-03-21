'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'

import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function DeleteEmailButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & { email: string }
) {
  const { email, children, ...buttonProps } = props
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['profile'])
  const router = useRouter()

  async function handleDeleteEmail() {
    const { error } = await liberwiki.auth.removeEmail({ email })
    if (error) {
      toast(t('profile:emailDeletionFailed'))
    } else {
      toast(t('profile:emailSuccessfullyDeleted'))
      router.refresh()
    }
  }

  return (
    <Button onClick={handleDeleteEmail} {...buttonProps}>
      {children}
    </Button>
  )
}
