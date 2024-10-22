import { useRouter } from 'next/navigation'

import * as Icons from 'lucide-react'

import { InfoItem } from '@/components/aciksozluk/Profile/InfoItem'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'

import config from '@/config'
import { useClientTranslation } from '@/i18n'
import { removeCookie } from '@/lib/serverActions'
import { useAcikSozlukAPI } from '@/lib/serverHooks'

import { format } from 'date-fns'
import { toast } from 'sonner'

export function Profile() {
  const aciksozluk = useAcikSozlukAPI()
  const router = useRouter()

  const { t } = useClientTranslation(['common', 'profile'])

  const { data: userData, isSuccess } = aciksozluk.me()

  async function handleLogout() {
    await removeCookie(config.api.bearerTokenCookieName)
    toast(t('profile:loggedOut'), { description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' hh:mm a") })
    router.push('/')
  }

  return (
    isSuccess &&
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
          <Button className="w-full gap-2" variant="default" onClick={handleLogout}>
            {t('profile:logout')}
            <Icons.LogOut className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    )
  )
}
