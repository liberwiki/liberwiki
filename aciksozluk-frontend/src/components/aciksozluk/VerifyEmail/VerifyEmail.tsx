'use client'

import { useRouter } from 'next/navigation'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'

import { useAcikSozlukAPI } from '@/lib/serverHooks'

import { format } from 'date-fns'
import { toast } from 'sonner'

export function VerifyEmail({ uidb64, token }: { uidb64: string; token: string }) {
  const aciksozluk = useAcikSozlukAPI()
  const router = useRouter()

  const { data: userData, isSuccess } = aciksozluk.user(atob(uidb64))
  const { mutateAsync: verifyEmail } = aciksozluk.verifyEmail()

  async function handleVerify() {
    const { response } = await verifyEmail({ uidb64, token })
    if (response.ok) {
      toast('Email verified successfully!', {
        description:
          'You will be redirected to the login page.\n${format(new Date(), "EEEE, MMMM dd, yyyy \'at\' hh:mm a")',
      })
      router.push('/auth/login')
    } else {
      toast('Verification failed. Please try again.\n${format(new Date(), "EEEE, MMMM dd, yyyy \'at\' hh:mm a")')
    }
  }

  async function handleReject() {
    router.push('/')
    toast('This incident has been recorded.', {
      description: `This email address will be deleted from our database.\n${format(new Date(), "EEEE, MMMM dd, yyyy 'at' hh:mm a")}`,
    })
  }

  return (
    isSuccess && (
      <Card className="mx-auto max-w-md flex-1">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>Please confirm your identity to complete the sign-up process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium">Are you {userData?.username}?</p>
            <p className="text-sm text-muted-foreground mt-1">Please confirm if this is your account</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between space-x-4">
          <Button onClick={handleVerify} className="flex-1 gap-2" variant="default">
            <Icons.CheckCircle className="h-4 w-4" />
            Yes, it's me
          </Button>
          <Button onClick={handleReject} className="flex-1 gap-2" variant="destructive">
            <Icons.XCircle className="h-4 w-4" />
            No, it's not me
          </Button>
        </CardFooter>
      </Card>
    )
  )
}
