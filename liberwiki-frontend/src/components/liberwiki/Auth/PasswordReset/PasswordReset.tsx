import Link from 'next/link'

import { PasswordResetForm } from '@/components/liberwiki/Auth/PasswordReset/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'

import { sUseTranslation } from '@/i18n'

export async function PasswordReset({ passwordResetKey }: { passwordResetKey: string }) {
  const { t } = await sUseTranslation(['common', 'auth'])

  return (
    <>
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold">{t('auth:resetPassword')}</CardTitle>
          <CardDescription>{t('auth:resetPasswordDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <PasswordResetForm passwordResetKey={passwordResetKey} />
        </CardContent>
      </Card>
      <div className="flex justify-center items-center">
        <Link href={{ pathname: '/auth/login' }} className="hover:underline">
          {t('common:login')}
        </Link>
      </div>
    </>
  )
}
