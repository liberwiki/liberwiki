import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React from 'react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

import config from '@/config'
import { useFormState } from '@/lib/hooks'
import { setCookie } from '@/lib/serverActions'
import { useAcikSozlukAPI } from '@/lib/serverHooks'

export function Login() {
  const aciksozluk = useAcikSozlukAPI()
  const router = useRouter()
  const { mutateAsync: obtainAuthToken } = aciksozluk.obtainAuthToken()

  const {
    formState: loginState,
    handleFormStateEvent: handleLoginStateEvent,
    formErrors: loginErrors,
    setFormErrors: setLoginErrors,
  } = useFormState<{
    email: string
    password: string
  }>({ email: '', password: '' })

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = await obtainAuthToken(loginState)
    if (data.response.ok) {
      await setCookie('BearerToken', data?.data?.token as string)
      setLoginErrors({})
      router.push('/titles/')
    } else {
      setLoginErrors(data.error)
    }
  }

  return (
    <Card className="mx-auto max-w-md flex-1">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your email and password to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={loginState.email}
                onChange={handleLoginStateEvent('email')}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={loginState.password}
                onChange={handleLoginStateEvent('password')}
                autoComplete="current-password"
              />
            </div>
            {loginErrors?.non_field_errors && (
              <div className="text-red-600 text-sm mt-2">{loginErrors.non_field_errors.join(' ')}</div>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
            <div className="w-100 flex justify-center">
              <Link href={{ pathname: '/auth/signup' }} className="hover:underline">
                Signup instead?
              </Link>
            </div>
            {!config.membersOnly && (
              <div className="w-100 flex justify-center">
                <Link href={{ pathname: '/titles' }} className="hover:underline">
                  Back to website?
                </Link>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
