'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import { Button } from '@/components/shadcn/button'

import { useClientTranslation } from '@/i18n'

import { toast } from 'sonner'

export default function RejectButton(props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'>) {
  const { children, ...buttonProps } = props
  const router = useRouter()
  const { t } = useClientTranslation(['verifyEmail'])

  async function handleReject() {
    toast(t('verifyEmail:verificationRejected'), { description: t('verifyEmail:emailWillBeDeleted') })
    router.push('/')
  }

  return (
    <Button onClick={handleReject} {...buttonProps}>
      {children}
    </Button>
  )
}
