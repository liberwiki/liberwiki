'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import { Button } from '@/components/shadcn/button'

import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function VerifyButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & {
    uidb64: string
    token: string
  }
) {
  const { children, uidb64, token, ...buttonProps } = props
  const liberwiki = useLiberWikiAPI()
  const router = useRouter()
  const { t } = useClientTranslation(['verifyEmail'])

  async function handleVerify() {
    const { response } = await liberwiki.verifyEmail({ uidb64, token })
    if (response.ok) {
      toast(t('verifyEmail:emailVerifiedSuccessfully'), { description: t('verifyEmail:youWillBeRedirectedToLogin') })
      router.push('/auth/login')
    } else {
      toast(t('verifyEmail:verificationFailed'))
    }
  }

  return (
    <Button onClick={handleVerify} {...buttonProps}>
      {children}
    </Button>
  )
}
