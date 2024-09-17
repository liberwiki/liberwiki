'use client'

import { NavTitle } from '@/components/aciksozluk/NavTitle'
import { cn } from '@/lib/utils'

export function LeftColumn() {
  return (
    <div className="w-full">
      <div className={cn('pb-4')}>
        <NavTitle titleId="7">The Undoing Project</NavTitle>
        <NavTitle titleId="1">Heroes</NavTitle>
        <NavTitle titleId="5">Nina Simone</NavTitle>
        <NavTitle titleId="4">Pixel Animation</NavTitle>
        <NavTitle titleId="2">Mathematical Physics for Computer Scientists</NavTitle>
        <NavTitle titleId="61">Right way to cook pasta</NavTitle>
        <NavTitle titleId="12">The Man From 3000</NavTitle>
        <NavTitle titleId="17">Terminator</NavTitle>
        <NavTitle titleId="121">MCAT</NavTitle>
        <NavTitle titleId="1">Apple vs Google vs Microsoft</NavTitle>
        <NavTitle titleId="52">Cognitive Biases and Human Psychology</NavTitle>
        <NavTitle titleId="4">Piano</NavTitle>
        <NavTitle titleId="2">To Kill a Mocking Bird</NavTitle>
        <NavTitle titleId="2">Benefits of licking a lizard</NavTitle>
        <NavTitle titleId="11">The Game</NavTitle>
        <NavTitle titleId="5">A rigorous introduction to probability theory</NavTitle>
        <NavTitle titleId="12">Why applied physics sucks</NavTitle>
        <NavTitle titleId="25">Monty Python</NavTitle>
        <NavTitle titleId="1">The Karman Line</NavTitle>
        <NavTitle titleId="5">All Tomorrows</NavTitle>
        <NavTitle titleId="6">Inflection Point</NavTitle>
        <NavTitle titleId="12">Ballpoint Pen for Art Students</NavTitle>
        <NavTitle titleId="2">Medical Sciences and how to study Medicine</NavTitle>
      </div>
    </div>
  )
}
