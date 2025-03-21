import Link from 'next/link'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'

import { sUseTranslation } from '@/i18n'

export async function SignupEmailSent() {
  const { t } = await sUseTranslation(['auth'])

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-2xl font-bold">{t('auth:verificationEmailSent')}</CardTitle>
        <CardDescription className="text-foreground">{t('auth:verificationEmailSentDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">{t('auth:verificationEmailSentCheckYourSpamFolder')}</CardContent>
      <CardFooter>
        <div className="flex justify-center items-center gap-2 w-full">
          <Link href={{ pathname: '/auth/login' }} className="hover:underline">
            {t('auth:backToLogin')}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
