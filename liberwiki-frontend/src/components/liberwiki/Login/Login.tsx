import { LoginForm } from '@/components/liberwiki/Login/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'

import { sUseTranslation } from '@/i18n'

export async function Login() {
  const { t } = await sUseTranslation(['common', 'login'])

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-2xl font-bold">{t('common:login')}</CardTitle>
        <CardDescription>{t('login:loginDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
