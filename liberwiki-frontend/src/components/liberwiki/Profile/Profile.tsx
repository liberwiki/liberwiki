import * as Icons from 'lucide-react'

import { InfoItem } from '@/components/liberwiki/Profile/InfoItem'
import { LogoutButton } from '@/components/liberwiki/Profile/client/LogoutButton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'

import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

import { format } from 'date-fns'

export async function Profile() {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['common', 'profile'])
  const { data: userData } = await liberwiki.me()

  return (
    userData && (
      <Card className="max-w-md w-full max-md:bg-background">
        <CardHeader className="flex flex-col gap-1 text-center">
          <CardTitle className="text-2xl font-bold">{t('profile:userProfile')}</CardTitle>
          <CardDescription>{t('profile:userProfileDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <InfoItem label={t('common:username')} value={userData.username} />
            <InfoItem label={t('profile:fullName')} value={`${userData.first_name} ${userData.last_name}`} />
            <InfoItem label={t('common:email')} value={userData.email} />
            <InfoItem label={t('profile:memberSince')} value={format(new Date(userData.created_at), 'MMMM d, yyyy')} />
            <InfoItem label={t('profile:titleCount')} value={userData.title_count} />
            <InfoItem label={t('profile:entryCount')} value={userData.entry_count} />
          </div>
        </CardContent>
        <CardFooter>
          <LogoutButton className="w-full gap-2" variant="default">
            {t('profile:logout')}
            <Icons.LogOut className="h-4 w-4" />
          </LogoutButton>
        </CardFooter>
      </Card>
    )
  )
}
