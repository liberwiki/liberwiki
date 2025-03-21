'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'

import { useClientTranslation } from '@/i18n'

import { toast } from 'sonner'

export default function RejectButton(props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'>) {
  const { children, ...buttonProps } = props
  const { t } = useClientTranslation(['auth'])
  const router = useRouter()

  async function handleReject() {
    toast(t('auth:emailVerificationRejected'), { description: t('auth:emailVerificationNoExtraActionNeeded') })
    router.push('/')
  }

  return (
    <Button onClick={handleReject} {...buttonProps}>
      {children}
    </Button>
  )
}
