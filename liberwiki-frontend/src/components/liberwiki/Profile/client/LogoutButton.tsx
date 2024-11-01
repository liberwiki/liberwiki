'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import { Button } from '@/components/shadcn/button'

import config from '@/config'
import { useClientTranslation } from '@/i18n'
import { removeCookie } from '@/lib/serverActions'
import { longFormattedDate } from '@/lib/utils'

import { toast } from 'sonner'

export function LogoutButton(props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'>) {
  const { children, ...buttonProps } = props
  const router = useRouter()
  const { t } = useClientTranslation(['profile'])

  async function handleLogout() {
    await removeCookie(config.api.bearerTokenCookieName)
    toast(t('profile:loggedOut'), { description: longFormattedDate() })
    router.push('/')
  }

  return (
    <Button onClick={handleLogout} {...buttonProps}>
      {children}
    </Button>
  )
}
