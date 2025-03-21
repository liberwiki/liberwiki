'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'

import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function MarkEmailPrimaryButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & { email: string }
) {
  const { email, children, ...buttonProps } = props
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['auth'])
  const router = useRouter()

  async function handleMarkEmailPrimary() {
    const { error } = await liberwiki.auth.markEmailPrimary({ email })
    if (error) {
      toast(t('auth:failedToMarkEmailPrimary'))
    } else {
      toast(t('auth:emailMarkedPrimarySuccessfully'))
      router.refresh()
    }
  }

  return (
    <Button onClick={handleMarkEmailPrimary} {...buttonProps}>
      {children}
    </Button>
  )
}
