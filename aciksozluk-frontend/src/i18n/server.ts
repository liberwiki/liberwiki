import { type Namespace, getConfig } from '~/src/i18n/config'

import config from '@/config'

import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'

const initI18next = async (ns: Namespace[]) => {
  const i18nInstance = createInstance()
  await i18nInstance.use(initReactI18next).init(getConfig(ns))
  return i18nInstance
}

export async function useTranslation(ns: Namespace[]) {
  const i18nextInstance = await initI18next(ns)
  return {
    t: i18nextInstance.getFixedT(config.language, ns),
    i18n: i18nextInstance,
  }
}
