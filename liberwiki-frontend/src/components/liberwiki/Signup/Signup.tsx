import { SignupForm } from '@/components/liberwiki/Signup/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'

import { sUseTranslation } from '@/i18n'

export async function Signup() {
  const { t } = await sUseTranslation(['common', 'signup'])

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-2xl font-bold">{t('common:signup')}</CardTitle>
        <CardDescription>{t('signup:signupWithInvitationCode')}</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  )
}
