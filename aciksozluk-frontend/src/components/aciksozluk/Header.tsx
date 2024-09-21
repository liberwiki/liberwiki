'use client'

import { CommandMenu } from '@/components/aciksozluk/CommandMenu'
import { MobileNav } from '@/components/aciksozluk/MobileNav'
import { Button } from '@/components/shadcn/button'
import config from '@/config/config'

import * as Icons from '@radix-ui/react-icons'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-white">
      <div className="container flex h-14 items-center max-md:px-4">
        <Link href="/aciksozluk-frontend/public" className="mr-4 items-center space-x-2 hidden md:flex">
          <Icons.VercelLogoIcon className="h-6 w-6" />
          <span className="hidden font-bold lg:inline-block">{config.name}</span>
        </Link>
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-center lg:mr-[calc(theme(space.12)+48px)]">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
        </div>
        <Button
          variant="ghost"
          className="ml-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Icons.PersonIcon className="h-4 w-4 md:h-6 md:w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>
    </header>
  )
}
