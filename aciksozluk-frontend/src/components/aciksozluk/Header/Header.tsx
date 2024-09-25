'use client'

import Link from 'next/link'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'

import config from '@/config/config'

import { AdvancedSearch } from './AdvancedSearch'
import { MobileNav } from './MobileNav'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-white">
      <div className="container flex h-14 items-center max-md:px-4">
        <Link href="/" className="mr-4 items-center space-x-2 hidden lg:flex">
          <Icons.Triangle className="h-6 w-6" />
          <span className="hidden font-bold lg:inline-block">{config.name}</span>
        </Link>
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-center lg:mr-[calc(theme(space.12)-64px)]">
          <div className="w-full md:flex-none">
            <AdvancedSearch />
          </div>
        </div>
        <Button
          variant="ghost"
          className="ml-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 gap-2"
        >
          <Icons.AudioLines className="h-4 w-4 md:h-6 md:w-6" />
          <span className="max-xl:hidden">Beats</span>
        </Button>
        <Button
          variant="ghost"
          className="ml-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 gap-2"
        >
          <Icons.User className="h-4 w-4 md:h-6 md:w-6" />
          <span className="max-xl:hidden">Profile</span>
        </Button>
      </div>
    </header>
  )
}
