import React, { useEffect, useRef, useState } from 'react'

import { AcikSozlukApi } from '@/api/api'
import config from '@/config/config'
import { getCookie } from '@/lib/serverActions'

export function useElementAttribute<T extends HTMLElement, K extends keyof T>(attributeKey: K) {
  const ref = useRef<T | null>(null)
  const [attributeValue, setAttributeValue] = useState<T[K] | null>(null)

  useEffect(() => {
    function updateAttribute() {
      if (ref.current) {
        setAttributeValue(ref.current[attributeKey])
      }
    }

    updateAttribute()
    window.addEventListener('resize', updateAttribute)

    return () => {
      window.removeEventListener('resize', updateAttribute)
    }
  }, [attributeKey])

  return { ref, attributeValue }
}

export function useFormState<T>(initialState: T) {
  const [formState, setFormState] = useState<T>(initialState)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof T, string[]>> & { non_field_errors?: string[] }>()

  function handleFormState({ key, inputType }: { key: keyof T; inputType: 'event' | 'value' }) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | T[keyof T]) => {
      let value
      if (inputType === 'event') {
        const target = (event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>).target
        value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
      } else {
        value = event as T[keyof T]
      }
      setFormState((prev) => ({ ...prev, [key]: value }))
    }
  }

  const handleFormStateValue = (key: keyof T) => handleFormState({ key, inputType: 'value' })
  const handleFormStateEvent = (key: keyof T) => handleFormState({ key, inputType: 'event' })

  return { formState, setFormState, formErrors, setFormErrors, handleFormStateValue, handleFormStateEvent }
}

export function useAcikSozlukAPI() {
  async function getBearerToken() {
    return await getCookie(config.api.bearerTokenCookieName)
  }
  return new AcikSozlukApi(getBearerToken)
}
