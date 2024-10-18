import { useRouter } from 'next/navigation'

import * as Icons from 'lucide-react'

import { InfoItem } from '@/components/aciksozluk/Profile/InfoItem'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'

import config from '@/config'
import { removeCookie } from '@/lib/serverActions'
import { useAcikSozlukAPI } from '@/lib/serverHooks'

import { format } from 'date-fns'
import { toast } from 'sonner'

export function Profile() {
  const aciksozluk = useAcikSozlukAPI()
  const router = useRouter()

  const { data: userData, isSuccess } = aciksozluk.me()

  async function handleLogout() {
    await removeCookie(config.api.bearerTokenCookieName)
    toast('Logged out.', { description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' hh:mm a") })
    router.push('/')
  }

  return (
    isSuccess &&
    userData && (
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
          <CardDescription>Your account information and statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <InfoItem label="Username" value={userData.username} />
            <InfoItem label="Full Name" value={`${userData.first_name} ${userData.last_name}`} />
            <InfoItem label="Email" value={userData.email} />
            <InfoItem label="Member since" value={format(new Date(userData.created_at), 'MMMM d, yyyy')} />
            <InfoItem label="Titles" value={userData.title_count} />
            <InfoItem label="Entries" value={userData.entry_count} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full gap-2" variant="default" onClick={handleLogout}>
            Logout
            <Icons.LogOut className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    )
  )
}
