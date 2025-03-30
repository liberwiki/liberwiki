import { CompleteSignupForm } from '@/components/liberwiki/Profile/CompleteSignup/client'

import { sUseTranslation } from '@/i18n'

export async function CompleteSignup() {
  const { t } = await sUseTranslation(['common', 'profile'])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h2 className="text-2xl font-bold">{t('profile:completeSignup')}</h2>
        <p className="text-muted-foreground text-md">{t('profile:completeSignupDescription')}</p>
      </div>
      <div className="flex flex-col gap-4">
        <CompleteSignupForm />
      </div>
    </div>
  )
}
