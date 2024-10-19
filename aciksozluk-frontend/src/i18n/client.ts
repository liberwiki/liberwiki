'use client'

import { type Namespace, getConfig } from '~/src/i18n/config'

import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOriginal } from 'react-i18next'

i18next.use(initReactI18next).init(getConfig())

export function useTranslation(ns: Namespace[]) {
  return useTranslationOriginal(ns)
}
