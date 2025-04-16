'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'

import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function VerifyButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & { verificationKey: string }
) {
  const { children, verificationKey, ...buttonProps } = props
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['auth'])
  const router = useRouter()

  async function handleVerify() {
    const { error } = await liberwiki.auth.verifyEmail({ key: verificationKey })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      const fieldErrors = _.chain(errors)
        .groupBy('param')
        .mapValues((i) => i.map((i) => i.message))
        .value()
      toast(t('auth:emailVerificationFailed'), { description: fieldErrors.key?.join('\n') })
    } else {
      toast(t('auth:emailVerifiedSuccessfully'))
      router.push('/auth/login')
    }
  }

  return (
    <Button onClick={handleVerify} {...buttonProps}>
      {children}
    </Button>
  )
}
