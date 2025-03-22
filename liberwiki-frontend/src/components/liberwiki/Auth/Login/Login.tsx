import Link from 'next/link'

import * as Brands from '@/components/icons/brands'
import { LoginForm } from '@/components/liberwiki/Auth/Login/client'
import { AutoFormButton } from '@/components/liberwiki/AutoFormButton/AutoFormButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { SeparatorWithText } from '@/components/shadcn/separator-with-text'

import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

export async function Login() {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['common', 'auth'])

  const providers = [
    { name: 'Google', icon: Brands.Google, id: 'google' },
    { name: 'Microsoft', icon: Brands.Microsoft, id: 'microsoft' },
  ]

  return (
    <>
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold">{t('common:login')}</CardTitle>
          <CardDescription>{t('auth:loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <LoginForm />
          <SeparatorWithText text={t('common:or')} />
          <div className="w-full flex gap-2 items-center justify-center">
            {providers.map((provider) => (
              <AutoFormButton
                key={provider.id}
                variant="outline"
                className="gap-2 w-full"
                type="submit"
                method="POST"
                action={liberwiki.auth.socialAuthFormAction}
                payload={{ callback_url: `${config.url}/profile/connections`, process: 'login', provider: provider.id }}
              >
                <provider.icon />
              </AutoFormButton>
            ))}
          </div>
        </CardContent>
      </Card>
      {!config.membersOnly && (
        <div className="flex justify-center items-center gap-2">
          <Link href={{ pathname: '/auth/signup' }} className="hover:underline">
            {t('common:signup')}
          </Link>
        </div>
      )}
    </>
  )
}
