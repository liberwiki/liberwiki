import { ChangePasswordForm, SetPasswordForm } from '@/components/liberwiki/Profile/Password/client'

import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

export async function Password() {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['profile'])

  const { data } = await liberwiki.auth.session()
  const hasPassword = (data?.data as Record<'user', Record<'has_usable_password', boolean>>).user?.has_usable_password

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h2 className="text-2xl font-bold">{t('profile:password')}</h2>
        <p className="text-muted-foreground text-md">{t('profile:passwordDescription')}</p>
      </div>
      {hasPassword ? <ChangePasswordForm /> : <SetPasswordForm />}
    </div>
  )
}
