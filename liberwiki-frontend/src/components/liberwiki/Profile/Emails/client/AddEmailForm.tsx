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

export default function AddEmailForm() {
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['auth'])
  const router = useRouter()

  const {
    formState: addEmailState,
    handleFormStateEvent: handleAddEmailStateEvent,
    formErrors: addEmailErrors,
    setFormErrors: setAddEmailErrors,
  } = useFormState<{
    email: string
  }>({
    email: '',
  })

  async function handleAddEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await liberwiki.auth.addEmail({ email: addEmailState.email })
    if (error) {
      const errors = (error as { errors: { message: string; code: string; param: string }[] }).errors
      setAddEmailErrors(
        _.chain(errors)
          .groupBy('param')
          .mapValues((i) => i.map((i) => i.message))
          .value()
      )
      toast(t('auth:addEmailFailed'))
    } else {
      router.refresh()
      toast(t('auth:emailAddedSuccessfully'))
    }
  }

  return (
    <form onSubmit={handleAddEmail}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t('auth:newEmail')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('auth:enterNewEmailAddress')}
            required
            value={addEmailState.email}
            onChange={handleAddEmailStateEvent('email')}
            errorText={addEmailErrors?.email?.join('\n')}
            autoComplete="email"
          />
        </div>
        <Button type="submit" className="w-full">
          {t('auth:addEmail')}
        </Button>
      </div>
    </form>
  )
}
