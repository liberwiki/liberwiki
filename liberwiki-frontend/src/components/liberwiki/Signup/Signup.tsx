import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React from 'react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/shadcn/input-otp'
import { Label } from '@/components/shadcn/label'

import config from '@/config'
import { useClientTranslation } from '@/i18n'
import { useFormState } from '@/lib/hooks'
import { useLiberWikiAPI } from '@/lib/serverHooks'

export function Signup() {
  const liberwiki = useLiberWikiAPI()
  const router = useRouter()

  const { t } = useClientTranslation(['common', 'signup'])

  const { mutateAsync: signup } = liberwiki.signup()

  const {
    formState: signupState,
    handleFormStateEvent: handleSignupStateEvent,
    handleFormStateValue: handleSignupStateValue,
    formErrors: signupErrors,
    setFormErrors: setSignupErrors,
  } = useFormState<{
    email: string
    username: string
    first_name: string
    last_name: string
    password: string
    password_confirmation: string
    invitation_code: string
  }>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirmation: '',
    invitation_code: '',
  })

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = await signup(signupState)
    if (data.response.ok) {
      setSignupErrors({})
      router.push('/auth/login')
    } else {
      setSignupErrors(data.error)
    }
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-2xl font-bold">{t('common:signup')}</CardTitle>
        <CardDescription>{t('signup:signupWithInvitationCode')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t('common:email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('signup:enterYourEmail')}
                required
                value={signupState.email}
                onChange={handleSignupStateEvent('email')}
                errorText={signupErrors?.email?.join(' ')}
                autoComplete="username"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">{t('common:username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('signup:enterYourUsername')}
                required
                value={signupState.username}
                onChange={handleSignupStateEvent('username')}
                errorText={signupErrors?.username?.join(' ')}
                autoComplete="username"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">{t('signup:password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('signup:enterYourPassword')}
                required
                value={signupState.password}
                onChange={handleSignupStateEvent('password')}
                errorText={signupErrors?.password?.join(' ')}
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password_confirmation">{t('signup:passwordConfirmation')}</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder={t('signup:enterYourPasswordConfirmation')}
                required
                value={signupState.password_confirmation}
                onChange={handleSignupStateEvent('password_confirmation')}
                errorText={signupErrors?.password_confirmation?.join(' ')}
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">{t('signup:invitationCode')}</Label>
              <div className="flex justify-center items-center">
                <InputOTP
                  pattern="[a-z0-9]+$"
                  id="invitation_code"
                  required
                  maxLength={8}
                  onChange={handleSignupStateValue('invitation_code')}
                  value={signupState.invitation_code}
                  inputMode="text"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            {signupErrors?.non_field_errors && (
              <div className="text-destructive text-sm mt-2">{signupErrors.non_field_errors.join(' ')}</div>
            )}
            <Button type="submit" className="w-full">
              {t('common:signup')}
            </Button>
            <div className="w-100 flex justify-center">
              <Link href={{ pathname: '/auth/login' }} className="hover:underline">
                {t('signup:loginInstead')}
              </Link>
            </div>
            {!config.membersOnly && (
              <div className="w-100 flex justify-center">
                <Link href={{ pathname: '/' }} className="hover:underline">
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
