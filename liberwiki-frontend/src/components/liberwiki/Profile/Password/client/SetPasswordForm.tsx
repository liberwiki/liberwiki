'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import PasswordInput from '@/components/liberwiki/PasswordInput'
import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'

import { useClientTranslation } from '@/i18n'
import { useFormState } from '@/lib/hooks'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function SetPasswordForm() {
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['common', 'profile'])
  const router = useRouter()

  const {
    formState: setPasswordState,
    handleFormStateEvent: handleSetPasswordStateEvent,
    formErrors: setPasswordErrors,
    setFormErrors: setSetPasswordErrors,
  } = useFormState<{
    password: string
  }>({
    password: '',
  })

  async function handlePasswordSet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await liberwiki.auth.resetUnusablePassword({ new_password: setPasswordState.password })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      setSetPasswordErrors(
        _.chain(errors)
          .groupBy('param')
          .mapValues((i) => i.map((i) => i.message))
          .value()
      )
      toast(t('profile:passwordSetFailed'))
    } else {
      router.refresh()
      toast(t('profile:passwordSetSuccessfully'))
    }
  }

  return (
    <form onSubmit={handlePasswordSet}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t('profile:password')}</Label>
          <PasswordInput
            id="password"
            type="password"
            placeholder={t('profile:setANewPassword')}
            required
            value={setPasswordState.password}
            onChange={handleSetPasswordStateEvent('password')}
            errorText={setPasswordErrors?.password?.join('\n')}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full">
          {t('profile:setPassword')}
        </Button>
      </div>
    </form>
  )
}
