import React from 'react'

import Footer from '@/components/liberwiki/Footer'
import Header from '@/components/liberwiki/Header'
import LeftColumn from '@/components/liberwiki/LeftColumn'
import RightColumn from '@/components/liberwiki/RightColumn'
import { ScrollArea } from '@/components/shadcn/scroll-area'

export default function TitleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="contents">
        <div vaul-drawer-wrapper="">
          <div className="relative flex min-h-screen flex-col bg-background">
            <div className="border-b">
              <div className="container flex-1 items-start xl:grid xl:grid-cols-[240px_minmax(0,1fr)_240px] max-md:px-0">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 xl:sticky xl:block">
                  <ScrollArea className="h-full py-6 pr-6">
                    <LeftColumn />
                  </ScrollArea>
                </aside>
                <main className="flex min-h-screen flex-col items-center pt-6">{children}</main>
                <aside className="fixed top-14 z-30 -mr-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 xl:sticky xl:block">
                  <ScrollArea className="h-full py-6 pl-6">
                    <RightColumn />
                  </ScrollArea>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
