'use client'

import { Button } from '@/components/shadcn/button'

import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function ResendVerificationEmailButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & { email: string }
) {
  const { email, children, ...buttonProps } = props
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['auth'])

  async function handleResendVerificationEmail() {
    const { error } = await liberwiki.auth.resendVerificationEmail({ email })
    if (error) {
      toast(t('auth:resendVerificationEmailFailed'))
    } else {
      toast(t('auth:verificationEmailResentSuccessfully'))
    }
  }

  return (
    <Button onClick={handleResendVerificationEmail} {...buttonProps}>
      {children}
    </Button>
  )
}
