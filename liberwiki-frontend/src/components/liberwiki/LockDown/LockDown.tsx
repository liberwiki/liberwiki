import Link from 'next/link'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { SeparatorWithText } from '@/components/shadcn/separator-with-text'

import config from '@/config'
import { sUseTranslation } from '@/i18n'

export async function LockDown() {
  const { t } = await sUseTranslation(['lockdown'])

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-3">
        <CardTitle className="text-2xl font-bold">{t('lockdown:lockdownTitle')}</CardTitle>
        <CardDescription className="text-base">
          {t('lockdown:lockdownDescription', { name: config.name })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full" size="lg">
            <Link prefetch={true} href={{ pathname: '/auth/signup' }} className="gap-2">
              {t('lockdown:signupWithInvitationCode')}
              <Icons.ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <SeparatorWithText text={t('common:or')} />
        <div className="flex flex-col gap-2">
          <Button variant="outline" asChild className="w-full" size="lg">
            <Link prefetch={true} href={{ pathname: '/auth/login' }} className="gap-2">
              {t('lockdown:haveAnAccountLogIn')}
              <Icons.LogIn className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
