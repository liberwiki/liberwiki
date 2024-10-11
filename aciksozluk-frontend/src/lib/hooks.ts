import React, { useEffect, useRef, useState } from 'react'

export function useElementAttribute<T extends HTMLElement, K extends keyof T>(attributeKey: K) {
  /**
   * Get the value of an attribute of an element for the given ref.
   */
  // Usage
  //
  // const {
  //   ref: targetElementRef,
  //   attributeValue: requestedAttributeValue,
  // } = useElementAttribute<SomeJSXElementThatTakesARef, keyof SomeJSXElementThatTakesARef>('requestedAttributeValue')
  //
  // requestedAttributeValue should be a key of SomeJSXElementThatTakesARef in this case
  //
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
  /**
   * A hook to manage form state, errors, and event/change handlers
   */

  // Usage
  //
  // const {
  // formState,
  // setFormState,
  // formErrors,
  // setFormErrors,
  // handleFormStateValue,
  // handleFormStateEvent,
  // } = useFormState<{key: string}>({key: ''})
  //
  // formState: is the current state of the form
  // setFormState:  is a function to update the form state directly, should be rarely used
  // formErrors:  is the current form errors
  // setFormErrors:  is a function to update the form errors directly, should be rarely used
  // handleFormStateValue("key"): is a function that when called with a key, onChange={handleFormStateValue("key")}
  // handleFormStateEvent("key"): is a function that when called with a key, onEvent={handleFormStateEvent("key")}
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
