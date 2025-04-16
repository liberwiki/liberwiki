'use client'

import { useState } from 'react'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'

import { cn } from '@/lib/utils'

export function PasswordInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = useState(false)

  function togglePasswordVisibility() {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative">
      <Input className={cn('pr-10', className)} {...props} type={showPassword ? 'text' : 'password'} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0.5 px-3 py-2 hover:bg-transparent"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <Icons.Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <Icons.EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
}
