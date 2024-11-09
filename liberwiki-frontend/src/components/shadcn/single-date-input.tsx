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
  const [dateWithTime, setDateWithTime] = useState<Date | undefined>(value)

  function handleSelect(date: Date | undefined) {
    setDateWithTime(date)
    onChange?.(date)
  }

  return (
    <>
      <Overlay breakpoint="md">
        <OverlayTrigger asChild>
          <Button
            variant="outline"
            className={`w-full text-left font-normal justify-between ${!dateWithTime && 'text-muted-foreground'}`}
          >
            {dateWithTime ? format(dateWithTime, 'PPP') : <span>{placeholder}</span>}
          </Button>
        </OverlayTrigger>
        <OverlayContent className="w-auto p-0" align="start" side="bottom">
          <Calendar mode="single" onSelect={handleSelect} selected={dateWithTime} />
        </OverlayContent>
      </Overlay>
      <Input
        form={form}
        type="hidden"
        value={dateWithTime ? format(dateWithTime, 'yyyy-MM-dd') : ''}
        onChange={(event) => {
          const dateString = event.target.value
          const selectedDate = dateString ? new Date(`${dateString}T00:00:00`) : undefined
          setDateWithTime(selectedDate)
          onChange?.(selectedDate)
        }}
        name={name}
      />
    </>
  )
}
