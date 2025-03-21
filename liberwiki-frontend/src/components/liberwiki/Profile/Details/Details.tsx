import * as Icons from 'lucide-react'

import { InfoItem } from '@/components/liberwiki/Profile/Details/InfoItem'
import { LogoutButton } from '@/components/liberwiki/Profile/Details/client'

import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

import { format } from 'date-fns'

export async function Details() {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['common', 'profile'])
  const { data: userData } = await liberwiki.me()

  return (
    userData && (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 items-center justify-center">
          <h2 className="text-2xl font-bold">{t('profile:userProfile')}</h2>
          <p className="text-muted-foreground text-md">{t('profile:userProfileDescription')}</p>
        </div>
        <div className="flex flex-col gap-4">
          <InfoItem label={t('common:username')} value={userData.username} />
          <InfoItem label={t('common:email')} value={userData.email} />
          <InfoItem label={t('profile:memberSince')} value={format(new Date(userData.created_at), 'MMMM d, yyyy')} />
          <InfoItem label={t('profile:titleCount')} value={userData.title_count} />
          <InfoItem label={t('profile:entryCount')} value={userData.entry_count} />
          <LogoutButton className="w-full gap-2">
            {t('profile:logout')}
            <Icons.LogOut className="h-4 w-4" />
          </LogoutButton>
        </div>
      </div>
    )
  )
}
