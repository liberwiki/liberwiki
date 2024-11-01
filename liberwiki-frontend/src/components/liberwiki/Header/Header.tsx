import Link from 'next/link'

import * as Icons from 'lucide-react'

import { MobileNav } from '@/components/liberwiki/Header/MobileNav'
import { AdvancedSearch } from '@/components/liberwiki/Header/client'
import { Button } from '@/components/shadcn/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/shadcn/sheet'

import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

export async function Header() {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['common'])

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-primary">
      <div className="container flex h-14 items-center max-md:px-4 gap-2">
        <div className="xl:w-1/6">
          <Link href={{ pathname: '/' }} className="items-center gap-2 hidden xl:flex">
            <Icons.Triangle className="h-6 w-6" />
            <span className="hidden font-bold lg:inline-block">{config.name}</span>
          </Link>
          <MobileNav />
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-center lg:w-4/6">
          <div className="w-full md:flex-none">
            <AdvancedSearch />
          </div>
        </div>
        <div className="xl:w-1/6 flex justify-end">
          {(await liberwiki.isAuthenticated()) ? (
            <Link href={{ pathname: '/account/profile' }}>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 gap-2"
              >
                <Icons.User className="h-6 w-6" />
                <span className="max-xl:hidden">{t('common:profile')}</span>
              </Button>
            </Link>
          ) : (
            <>
              <div className="hidden lg:contents">
                <Link href={{ pathname: '/auth/login' }}>
                  <Button variant="ghost">{t('common:login')}</Button>
                </Link>
                <Link href={{ pathname: '/auth/signup' }}>
                  <Button variant="ghost">{t('common:signup')}</Button>
                </Link>
              </div>
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
                    >
                      <Icons.User className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetHeader className="hidden">
                    <SheetDescription className="hidden">{t('common:account')}</SheetDescription>
                  </SheetHeader>
                  <SheetTitle className="hidden">{t('common:account')}</SheetTitle>
                  <SheetContent side="bottom" className="px-2 flex flex-col">
                    <Link href={{ pathname: '/auth/login' }}>
                      <Button variant="ghost">{t('common:login')}</Button>
                    </Link>
                    <Link href={{ pathname: '/auth/signup' }}>
                      <Button variant="ghost">{t('common:signup')}</Button>
                    </Link>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
