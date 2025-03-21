'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import PasswordInput from '@/components/liberwiki/PasswordInput'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

import { useClientTranslation } from '@/i18n'
import { useFormState } from '@/lib/hooks'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function SignupForm() {
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['auth'])
  const router = useRouter()

  const {
    formState: signupState,
    handleFormStateEvent: handleSignupStateEvent,
    formErrors: signupErrors,
    setFormErrors: setSignupErrors,
  } = useFormState<{
    username: string
    email: string
    password: string
  }>({
    username: '',
    email: '',
    password: '',
  })

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { response, error } = await liberwiki.auth.signup({
      username: signupState.username,
      email: signupState.email,
      password: signupState.password,
    })
    if (error && response?.status !== 401) {
      // Django Allauth returns 401 for a successful signup attempt
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      setSignupErrors(
        _.chain(errors)
          .groupBy('param')
          .mapValues((i) => i.map((i) => i.message))
          .value()
      )
      toast(t('auth:signupFailed'))
    } else {
      router.push('/auth/signup-email-sent')
      toast(t('auth:successfullySignedUp'))
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">{t('common:username')}</Label>
          <Input
            id="username"
            type="text"
            placeholder={t('auth:enterUsername')}
            required
            value={signupState.username}
            onChange={handleSignupStateEvent('username')}
            errorText={signupErrors?.username?.join('\n')}
            autoComplete="username"
          />
          <Label htmlFor="email">{t('common:email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('auth:enterEmailAddress')}
            required
            value={signupState.email}
            onChange={handleSignupStateEvent('email')}
            errorText={signupErrors?.email?.join('\n')}
            autoComplete="email"
          />
          <Label htmlFor="password">{t('auth:password')}</Label>
          <PasswordInput
            id="password"
            type="password"
            placeholder={t('auth:setANewPassword')}
            required
            value={signupState.password}
            onChange={handleSignupStateEvent('password')}
            errorText={signupErrors?.password?.join('\n')}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full">
          {t('common:signup')}
        </Button>
      </div>
    </form>
  )
}
