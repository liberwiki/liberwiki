'use client'

import { useRouter } from 'next/navigation'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'

import { useClientTranslation } from '@/i18n'
import { useAcikSozlukAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export function VerifyEmail({ uidb64, token }: { uidb64: string; token: string }) {
  const aciksozluk = useAcikSozlukAPI()
  const router = useRouter()

  const { t } = useClientTranslation(['verifyEmail'])

  const { data: userData, isSuccess } = aciksozluk.user(atob(uidb64))
  const { mutateAsync: verifyEmail } = aciksozluk.verifyEmail()

  async function handleVerify() {
    const { response } = await verifyEmail({ uidb64, token })
    if (response.ok) {
      toast(t('verifyEmail:emailVerifiedSuccessfully'), { description: t('verifyEmail:youWillBeRedirectedToLogin') })
      router.push('/auth/login')
    } else {
      toast(t('verifyEmail:verificationFailed'))
    }
  }

  async function handleReject() {
    router.push('/')
    toast(t('verifyEmail:verificationRejected'), { description: t('verifyEmail:emailWillBeDeleted') })
  }

  return (
    isSuccess &&
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
          <Button onClick={handleVerify} className="flex-1 gap-2" variant="default">
            <Icons.CheckCircle className="h-4 w-4" />
            {t('verifyEmail:yesItsMe')}
          </Button>
          <Button onClick={handleReject} className="flex-1 gap-2" variant="destructive">
            <Icons.XCircle className="h-4 w-4" />
            {t('verifyEmail:noItsNotMe')}
          </Button>
        </CardFooter>
      </Card>
    )
  )
}
