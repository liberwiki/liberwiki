import Link from 'next/link'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { SeparatorWithText } from '@/components/shadcn/separator-with-text'

import config from '@/config/config'

export function LockDown() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 gap-2">
        <CardTitle className="text-2xl font-bold">Closed Beta</CardTitle>
        <CardDescription className="text-base">
          {config.name} is currently in closed beta. You need an invitation code to sign up.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button asChild className="w-full" size="lg">
            <Link href={{ pathname: '/auth/signup' }}>
              Sign up with invitation code
              <Icons.ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <SeparatorWithText text="or" />
        <div className="space-y-2">
          <Button variant="outline" asChild className="w-full" size="lg">
            <Link href={{ pathname: '/auth/login' }}>
              Already have an account? Log in
              <Icons.LogIn className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <SeparatorWithText text="or" />
        <div className="space-y-2">
          <Button variant="secondary" asChild className="w-full" size="lg">
            <Link href={{ pathname: '/auth/waitlist' }}>
              Join the waitlist
              <Icons.Mail className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-center text-muted-foreground">No code? Get notified when we open to the public.</p>
        </div>
      </CardContent>
    </Card>
  )
}
