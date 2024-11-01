import * as Icons from 'lucide-react'

import { RejectButton, VerifyButton } from '@/components/liberwiki/VerifyEmail/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'

import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

export async function VerifyEmail({ uidb64, token }: { uidb64: string; token: string }) {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['verifyEmail'])
  const { data: userData } = await liberwiki.user(atob(uidb64))

  return (
    userData && (
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col gap-1 text-center">
          <CardTitle className="text-2xl font-bold">{t('verifyEmail:emailVerification')}</CardTitle>
          <CardDescription>{t('verifyEmail:confirmYourIdentity')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="text-center flex flex-col gap-1">
            <p className="text-lg font-medium">{t('verifyEmail:areYou', { username: userData.username })}</p>
            <p className="text-sm text-muted-foreground ">{t('verifyEmail:confirmAccount')}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <VerifyButton className="flex-1 gap-2" variant="default" uidb64={uidb64} token={token}>
            <Icons.CheckCircle className="h-4 w-4" />
            {t('verifyEmail:yesItsMe')}
          </VerifyButton>
          <RejectButton className="flex-1 gap-2" variant="destructive">
            <Icons.XCircle className="h-4 w-4" />
            {t('verifyEmail:noItsNotMe')}
          </RejectButton>
        </CardFooter>
      </Card>
    )
  )
}
