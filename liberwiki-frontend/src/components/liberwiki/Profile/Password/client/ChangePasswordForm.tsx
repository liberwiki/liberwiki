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

export default function ChangePasswordForm() {
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['profile'])
  const router = useRouter()

  const {
    formState: passwordResetState,
    handleFormStateEvent: handlePasswordResetStateEvent,
    formErrors: passwordResetErrors,
    setFormErrors: setPasswordResetErrors,
  } = useFormState<{
    current_password: string
    new_password: string
  }>({
    current_password: '',
    new_password: '',
  })

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await liberwiki.auth.resetPassword({
      current_password: passwordResetState.current_password,
      new_password: passwordResetState.new_password,
    })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      setPasswordResetErrors(
        _.chain(errors)
          .groupBy('param')
          .mapValues((i) => i.map((i) => i.message))
          .value()
      )
      toast(t('profile:passwordChangeFailed'))
    } else {
      router.refresh()
      toast(t('profile:passwordChangedSuccessfully'))
    }
  }

  return (
    <form onSubmit={handlePasswordChange}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentPassword">{t('profile:currentPassword')}</Label>
          <PasswordInput
            id="currentPassword"
            type="password"
            placeholder={t('profile:enterYourCurrentPassword')}
            required
            value={passwordResetState.current_password}
            onChange={handlePasswordResetStateEvent('current_password')}
            errorText={passwordResetErrors?.current_password?.join('<br>')}
            autoComplete="current-password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="newPassword">{t('profile:newPassword')}</Label>
          <PasswordInput
            id="newPassword"
            type="password"
            placeholder={t('profile:setANewPassword')}
            required
            value={passwordResetState.new_password}
            onChange={handlePasswordResetStateEvent('new_password')}
            errorText={passwordResetErrors?.new_password?.join('\n')}
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
