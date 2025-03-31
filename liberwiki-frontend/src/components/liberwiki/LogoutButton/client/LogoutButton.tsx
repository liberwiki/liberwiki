'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/button'

import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function LogoutButton(props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'>) {
  const { children, ...buttonProps } = props
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['profile'])
  const router = useRouter()

  async function handleLogout() {
    await liberwiki.auth.logout()
    router.push('/')
    router.refresh()
    toast(t('profile:loggedOut'))
  }

  return (
    <Button onClick={handleLogout} {...buttonProps}>
      {children}
    </Button>
  )
}
