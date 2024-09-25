'use client'

import React from 'react'

import * as Icons from 'lucide-react'

import { Toggle } from '@/components/shadcn/toggle'

interface EditorButtonProps {
  pressed?: boolean
  onPressedChange?: () => void
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
  icon?: Icons.LucideIcon
}

const EditorButton = ({
  pressed,
  onPressedChange,
  ariaLabel,
  className = '',
  style = {},
  icon: Icon,
}: EditorButtonProps) => {
  return (
    <Toggle
      size="sm"
      aria-label={ariaLabel}
      pressed={pressed}
      onPressedChange={onPressedChange}
      className={`bg-background data-[state=on]:brightness-[110%] hover:bg-background ${className}`}
      style={style}
    >
      {Icon && <Icon className="h-3 w-3" />}
    </Toggle>
  )
}

export default EditorButton
