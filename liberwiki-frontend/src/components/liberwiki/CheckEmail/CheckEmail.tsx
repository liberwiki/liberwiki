import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'

import { sUseTranslation } from '@/i18n'

export async function CheckEmail() {
  const { t } = await sUseTranslation(['checkEmail'])

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-1 text-center">
        <CardTitle className="text-2xl font-bold">{t('checkEmail:emailVerification')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-center flex flex-col gap-1">
          <p className="text-sm text-muted-foreground ">{t('checkEmail:emailConfirmation')}</p>
        </div>
      </CardContent>
    </Card>
  )
}
