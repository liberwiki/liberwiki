'use client'

import { useRouter } from 'next/navigation'

import PasswordInput from '@/components/liberwiki/PasswordInput'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

import { useClientTranslation } from '@/i18n'
import { useFormState } from '@/lib/hooks'
import { useLiberWikiAPI } from '@/lib/serverHooks'

import { toast } from 'sonner'

export default function CompleteSignupForm() {
  const liberwiki = useLiberWikiAPI()
  const { t } = useClientTranslation(['common', 'profile'])
  const router = useRouter()

  const {
    formState: completeSignupState,
    handleFormStateEvent: handleCompleteSignupEvent,
    formErrors: completeSignupErrors,
    setFormErrors: setCompleteSignupErrors,
  } = useFormState<{
    username: string
    password: string
  }>({
    username: '',
    password: '',
  })

  async function handleCompleteSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { error } = await liberwiki.completeSignup({
      username: completeSignupState.username,
      password: completeSignupState.password,
    })
    if (error) {
      setCompleteSignupErrors(error)
      toast(t('profile:completeSignupFailed'))
    } else {
      router.push('/')
      toast(t('profile:completedSignupSuccessfully'))
    }
  }

  return (
    <form onSubmit={handleCompleteSignup}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t('profile:username')}</Label>
          <Input
            id="username"
            type="text"
            placeholder={t('profile:setANewUsername')}
            required
            value={completeSignupState.username}
            onChange={handleCompleteSignupEvent('username')}
            errorText={completeSignupErrors?.username?.join('\n')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t('profile:password')}</Label>
          <PasswordInput
            id="password"
            type="text"
            placeholder={t('profile:setPassword')}
            required
            value={completeSignupState.password}
            onChange={handleCompleteSignupEvent('password')}
            errorText={completeSignupErrors?.password?.join('\n')}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full">
          {t('profile:completeSignup')}
        </Button>
      </div>
    </form>
  )
}
