import Link from 'next/link'

import { ForgotPasswordForm } from '@/components/liberwiki/Auth/ForgotPassword/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { SeparatorWithText } from '@/components/shadcn/separator-with-text'

import { sUseTranslation } from '@/i18n'

export async function ForgotPassword() {
  const { t } = await sUseTranslation(['common', 'auth'])

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-2xl font-bold">{t('auth:resetPassword')}</CardTitle>
        <CardDescription>{t('auth:resetPasswordFormDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ForgotPasswordForm />
        <SeparatorWithText text={t('common:or')} />
        <div className="flex justify-center items-center gap-2">
          <Link href={{ pathname: '/auth/login' }} className="hover:underline">
            {t('common:login')}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
