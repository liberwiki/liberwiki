import * as Icons from 'lucide-react'

import _ from 'lodash'

import * as Brands from '@/components/icons/brands'
import { AutoFormButton } from '@/components/liberwiki/AutoFormButton/AutoFormButton'
import { DisconnectButton } from '@/components/liberwiki/Profile/Connections/client'
import { Badge } from '@/components/shadcn/badge'

import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

export async function Connections() {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['common', 'profile'])

  const { data } = await liberwiki.auth.connections()
  const connections = data?.data as { uid: string; display: string; provider: { id: string; name: string } }[]
  const connectedAccounts: string[] = connections ? _.map(connections, 'provider.id') : []
  const providerToUidMap = connections ? _.fromPairs(_.map(connections, (a) => [a.provider.id, a.uid])) : {}

  const providers = [
    { name: 'Google', icon: Brands.Google, id: 'google' },
    { name: 'Microsoft', icon: Brands.Microsoft, id: 'microsoft' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h2 className="text-2xl font-bold">{t('profile:connections')}</h2>
        <p className="text-muted-foreground text-md">{t('profile:connectionsDescription')}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {providers.map((provider) => (
          <li key={provider.id} className="flex items-center justify-between py-2 px-3 border rounded">
            <div className="flex items-center gap-2">
              <provider.icon />
              <span className="font-medium">{provider.name}</span>
              {connectedAccounts.includes(provider.id) ? (
                <Badge variant="default" className="bg-green-500">
                  <Icons.Check className="w-4 h-4" />
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Icons.X className="w-4 h-4" />
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {connectedAccounts.includes(provider.id) ? (
                <DisconnectButton provider={provider.id} account={providerToUidMap[provider.id]}>
                  {t('profile:disconnect')}
                </DisconnectButton>
              ) : (
                <AutoFormButton
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full"
                  type="submit"
                  method="POST"
                  action={liberwiki.auth.socialAuthFormAction}
                  payload={{
                    callback_url: `${config.url}/profile/connections`,
                    process: 'connect',
                    provider: provider.id,
                  }}
                >
                  {t('profile:connect')}
                </AutoFormButton>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
