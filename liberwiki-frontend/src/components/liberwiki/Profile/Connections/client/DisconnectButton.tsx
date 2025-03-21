'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'

import { useClientTranslation } from '@/i18n'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function DisconnectButton(
  props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & { provider: string; account: string }
) {
  const { provider, account, children, ...buttonProps } = props
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['auth'])
  const router = useRouter()

  async function handleDisconnect() {
    const { error } = await liberwiki.auth.removeConnection({ provider, account })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      const fieldErrors = _.chain(errors)
        .groupBy('param')
        .mapValues((i) => i.map((i) => i.message))
        .value()
      toast(t('auth:couldNotDisconnectAccount'), { description: fieldErrors.account?.join('\n') })
    } else {
      router.refresh()
      toast(t('auth:accountSuccessfullyDisconnected'))
    }
  }

  return (
    <Button onClick={handleDisconnect} {...buttonProps}>
      {children}
    </Button>
  )
}
