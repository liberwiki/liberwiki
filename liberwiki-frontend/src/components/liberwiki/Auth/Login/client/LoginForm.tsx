'use client'

import Link from 'next/link'
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

export default function LoginForm() {
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['common', 'auth'])
  const router = useRouter()

  const {
    formState: loginState,
    handleFormStateEvent: handleLoginStateEvent,
    formErrors: loginErrors,
    setFormErrors: setLoginErrors,
  } = useFormState<{
    usernameOREmail: string
    password: string
  }>({
    usernameOREmail: '',
    password: '',
  })

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const usernameOREmail = loginState.usernameOREmail
    const { error } = await liberwiki.auth.login({
      username: usernameOREmail,
      password: loginState.password,
    })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      const fieldErrors = _.chain(errors)
        .groupBy('param')
        .mapValues((i) => i.map((i) => i.message))
        .value()
      setLoginErrors({
        usernameOREmail: [...(fieldErrors?.username || []), ...(fieldErrors?.email || [])],
        password: fieldErrors?.password,
      })
      toast(t('auth:loginFailed'))
    } else {
      router.push('/')
      router.refresh()
      toast(t('auth:loggedInSuccessfully'))
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="usernameOREmail">{t('auth:usernameOrEmailLabel')}</Label>
          <Input
            id="usernameOREmail"
            type="text"
            placeholder={t('auth:usernameOREmail')}
            required
            value={loginState.usernameOREmail}
            onChange={handleLoginStateEvent('usernameOREmail')}
            errorText={loginErrors?.usernameOREmail?.join('\n')}
            autoComplete="username"
          />
          <Label htmlFor="password">{t('auth:password')}</Label>
          <PasswordInput
            id="password"
            type="password"
            placeholder={t('auth:enterYourPassword')}
            required
            value={loginState.password}
            onChange={handleLoginStateEvent('password')}
            errorText={loginErrors?.password?.join('\n')}
            autoComplete="password"
          />
          <div className="w-full flex justify-end items-center">
            <Link href={{ pathname: '/auth/forgot-password' }} className="text-sm hover:underline">
              {t('auth:forgotPassword')}
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full">
          {t('common:login')}
        </Button>
      </div>
    </form>
  )
}
