'use client'

import * as Icons from 'lucide-react'

import NavTitle from '@/components/aciksozluk/NavTitle'
import { Button } from '@/components/shadcn/button'
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/shadcn/sheet'

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Icons.Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-2">
        <ScrollArea className="my-4 h-[calc(100vh-4rem)] pr-0">
          <div className="flex flex-col">
            <NavTitle id="7">The Undoing Project</NavTitle>
            <NavTitle id="1">Heroes</NavTitle>
            <NavTitle id="5">Nina Simone</NavTitle>
            <NavTitle id="4">Pixel Animation</NavTitle>
            <NavTitle id="2">Mathematical Physics for Computer Scientists</NavTitle>
            <NavTitle id="61">Right way to cook pasta</NavTitle>
            <NavTitle id="12">The Man From 3000</NavTitle>
            <NavTitle id="17">Terminator</NavTitle>
            <NavTitle id="121">MCAT</NavTitle>
            <NavTitle id="1">Apple vs Google vs Microsoft</NavTitle>
            <NavTitle id="52">Cognitive Biases and Human Psychology</NavTitle>
            <NavTitle id="4">Piano</NavTitle>
            <NavTitle id="2">To Kill a Mocking Bird</NavTitle>
            <NavTitle id="2">Benefits of licking a lizard</NavTitle>
            <NavTitle id="11">The Game</NavTitle>
            <NavTitle id="5">A rigorous introduction to probability theory</NavTitle>
            <NavTitle id="12">Why applied physics sucks</NavTitle>
            <NavTitle id="25">Monty Python</NavTitle>
            <NavTitle id="1">The Karman Line</NavTitle>
            <NavTitle id="5">All Tomorrows</NavTitle>
            <NavTitle id="6">Inflection Point</NavTitle>
            <NavTitle id="12">Ballpoint Pen for Art Students</NavTitle>
            <NavTitle id="2">Medical Sciences and how to study Medicine</NavTitle>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
