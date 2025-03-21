'use client'

import { useRouter } from 'next/navigation'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

import { useClientTranslation } from '@/i18n'
import { useFormState } from '@/lib/hooks'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function RequestPasswordForm() {
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['common', 'auth'])
  const router = useRouter()

  const {
    formState: requestPasswordState,
    handleFormStateEvent: handleRequestPasswordStateEvent,
    formErrors: requestPasswordErrors,
    setFormErrors: setRequestPasswordErrors,
  } = useFormState<{
    email: string
  }>({
    email: '',
  })

  async function handleRequestPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await liberwiki.auth.requestPasswordReset({ email: requestPasswordState.email })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      setRequestPasswordErrors(
        _.chain(errors)
          .groupBy('param')
          .mapValues((i) => i.map((i) => i.message))
          .value()
      )
      toast(t('auth:sendPasswordResetEmailFailed'))
    } else {
      router.push('/auth/password-reset-email-sent')
      toast(t('auth:passwordEmailSentSuccessfully'))
    }
  }

  return (
    <form onSubmit={handleRequestPassword}>
      <div className="flex flex-col gap-4">
        <Label htmlFor="email">{t('common:email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('auth:enterYourEmail')}
          required
          value={requestPasswordState.email}
          onChange={handleRequestPasswordStateEvent('email')}
          autoComplete="email"
          errorText={requestPasswordErrors?.email?.join('\n')}
        />
        <Button type="submit" className="w-full">
          {t('auth:resetPassword')}
        </Button>
      </div>
    </form>
  )
}
