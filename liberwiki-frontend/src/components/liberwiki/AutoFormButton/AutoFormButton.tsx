'use client'

import { forwardRef, useRef } from 'react'

import _ from 'lodash'

import { Button } from '@/components/shadcn/button'

import { useLiberWikiAPI } from '@/lib/serverHooks'
import { getLazyValueAsync } from '@/lib/utils'

// TODO@next15: Remove forwardRef and turn this back to a function component
export const AutoFormButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & {
    action: string
    method?: 'GET' | 'POST'
    payload?: Record<string, string>
  }
>(({ action, method = 'POST', payload = {}, children, ...buttonProps }, ref) => {
  const liberwiki = useLiberWikiAPI()
  const formRef = useRef<HTMLFormElement | null>(null)

  const handleClick = async () => {
    if (!formRef.current) {
      const form = document.createElement('form')
      form.action = action
      form.method = method
      form.style.display = 'none'

      const csrfTokenPayload = {
        [liberwiki.config.csrfTokenPostKey]: await getLazyValueAsync<string | null>(liberwiki.csrfToken),
      }

      Object.entries({ ...payload, ...csrfTokenPayload }).forEach(([key, value]) => {
        if (!_.isNil(value)) {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value.toString()
          form.appendChild(input)
        }
      })

      document.body.appendChild(form)
      formRef.current = form
    }

    formRef.current.submit()
  }

  return (
    <Button {...buttonProps} ref={ref} onClick={handleClick}>
      {children}
    </Button>
  )
})

AutoFormButton.displayName = 'AutoFormButton'
