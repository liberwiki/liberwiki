'use client'

import * as React from 'react'
import { useState } from 'react'
import { Input } from '@/components/shadcn/input'
import { Calendar } from '@/components/shadcn/calendar'
import { Button } from '@/components/shadcn/button'
import { format } from 'date-fns'
import { Overlay, OverlayContent, OverlayTrigger } from '@/components/shadcn/overlay'

export function SingleDateInput({ name, value = undefined, form = undefined, placeholder = '', onChange }: {
  name: string,
  value?: Date,
  form?: string,
  placeholder?: string,
  onChange?: (value: Date | undefined) => void
}) {
  const [date, setDate] = useState<string>(value?.toISOString() || '')

  function handleSelect(date: Date | undefined) {
    const dateWithoutTimezone = date?.toISOString().split('T')[0]
    setDate(dateWithoutTimezone || '')
  }

  return (
    <>
      <Overlay breakpoint="md">
        <OverlayTrigger asChild>
          <Button
            variant="outline"
            className={`w-full text-left font-normal justify-between ${!date && 'text-muted-foreground'}`}
          >
            {date ? (format(date, 'PPP')) : (<span>{placeholder}</span>)}
          </Button>
        </OverlayTrigger>
        <OverlayContent className="w-auto p-0" align="start" side="bottom">
          <Calendar mode="single" onSelect={handleSelect} selected={(date ? new Date(date) : undefined)} />
        </OverlayContent>
      </Overlay>
      <Input
        form={form}
        type="hidden"
        value={date}
        onChange={(event) => {
          const dateString = event.target.value
          const dateWithoutTimezone = new Date(dateString).toISOString().split('T')[0]
          setDate(dateWithoutTimezone)
        }}
        name={name}
      />
    </>
  )
}
