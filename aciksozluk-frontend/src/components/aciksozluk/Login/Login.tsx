import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React from 'react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

import config from '@/config'
import { useClientTranslation } from '@/i18n'
import { useFormState } from '@/lib/hooks'
import { setCookie } from '@/lib/serverActions'
import { useAcikSozlukAPI } from '@/lib/serverHooks'

export function Login() {
  const aciksozluk = useAcikSozlukAPI()
  const router = useRouter()

  const { t } = useClientTranslation(['common', 'login'])

  const { mutateAsync: obtainAuthToken } = aciksozluk.obtainAuthToken()

  const {
    formState: loginState,
    handleFormStateEvent: handleLoginStateEvent,
    formErrors: loginErrors,
    setFormErrors: setLoginErrors,
  } = useFormState<{
    email: string
    password: string
  }>({ email: '', password: '' })

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = await obtainAuthToken(loginState)
    if (data.response.ok) {
      await setCookie('BearerToken', data?.data?.token as string)
      setLoginErrors({})
      router.push('/titles/')
    } else {
      setLoginErrors(data.error)
    }
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t('common:login')}</CardTitle>
        <CardDescription>{t('login:loginDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('common:email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('login:enterYourEmail')}
                required
                value={loginState.email}
                onChange={handleLoginStateEvent('email')}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login:password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('login:enterYourPassword')}
                required
                value={loginState.password}
                onChange={handleLoginStateEvent('password')}
                autoComplete="current-password"
              />
            </div>
            {loginErrors?.non_field_errors && (
              <div className="text-red-600 text-sm mt-2">{loginErrors.non_field_errors.join(' ')}</div>
            )}
            <Button type="submit" className="w-full">
              {t('common:login')}
            </Button>
            <div className="w-100 flex justify-center">
              <Link href={{ pathname: '/auth/signup' }} className="hover:underline">
                {t('login:signUpInstead')}
              </Link>
            </div>
            {!config.membersOnly && (
              <div className="w-100 flex justify-center">
                <Link href={{ pathname: '/titles' }} className="hover:underline">
                  {t('common:backToWebsite')}
                </Link>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
