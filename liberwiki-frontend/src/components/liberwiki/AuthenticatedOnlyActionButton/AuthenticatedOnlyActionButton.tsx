'use client'

import Link from 'next/link'

import type React from 'react'
import { useState } from 'react'

import * as Icons from 'lucide-react'

import { Button, type ButtonProps, buttonVariants } from '@/components/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'

import { cn } from '@/lib/utils'

export function AuthenticatedOnlyActionButton({
  isAuthenticated,
  onClick,
  children,
  ...props
}: ButtonProps & { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAuthenticated) {
      onClick?.(e)
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <Button onClick={handleClick} {...props}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md gap-0">
          <DialogHeader>
            <DialogTitle className="text-xl">Sign Up!</DialogTitle>
            <DialogDescription className="text-muted-foreground whitespace-pre-line">
              You need an account to do that. Join the fun.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Link
              href={{ pathname: '/auth/login' }}
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  className: 'w-full justify-between border-muted-foreground/20 hover:bg-muted/50 gap-2',
                })
              )}
            >
              <span className="flex items-center gap-2">Log in to your account</span>
              <Icons.ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={{ pathname: '/auth/signup' }}
              className={cn(
                buttonVariants({
                  variant: 'default',
                  className: 'w-full justify-between bg-primary hover:bg-primary/90 gap-2',
                })
              )}
            >
              <span className="flex items-center gap-2">Create new account</span>
              <Icons.ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
