import * as Icons from 'lucide-react'

import { RejectButton, VerifyButton } from '@/components/liberwiki/Auth/VerifyEmail/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'

import { sUseTranslation } from '@/i18n'

export async function VerifyEmail({ verificationKey }: { verificationKey: string }) {
  const { t } = await sUseTranslation(['auth'])

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-1 text-center">
        <CardTitle className="text-2xl font-bold">{t('auth:emailVerification')}</CardTitle>
        <CardDescription>{t('auth:emailVerificationDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-center flex flex-col gap-1">
          <small className="text-xs text-muted-foreground">
            {t('auth:emailVerificationStepIsManualBecauseSecurity')}
          </small>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <VerifyButton className="flex-1 gap-2" variant="default" verificationKey={decodeURIComponent(verificationKey)}>
          <Icons.CheckCircle className="h-4 w-4" />
          <span>{t('auth:verify')}</span>
        </VerifyButton>
        <RejectButton className="flex-1 gap-2" variant="destructive">
          <Icons.XCircle className="h-4 w-4" />
          <span>{t('auth:reject')}</span>
        </RejectButton>
      </CardFooter>
    </Card>
  )
}
