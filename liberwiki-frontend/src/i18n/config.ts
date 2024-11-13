import _ from 'lodash'

import config from '@/config'

import type { InitOptions } from 'i18next'

export const languages = ['en', 'tr'] as const
export const namespaces = [
  'common',
  'editor',
  'login',
  'verifyEmail',
  'checkEmail',
  'profile',
  'entry',
  'signup',
  'footer',
  'advancedTitleSearch',
  'advancedEntrySearch',
  'lockdown',
  'title',
  'paginator',
] as const

export type Language = (typeof languages)[number]
export type Namespace = (typeof namespaces)[number]

// eslint-disable-next-line @typescript-eslint/no-require-imports
const locales = (lang: Language, ns: Namespace) => require(`../locales/${lang}/${ns}.json`)

const resources = _.fromPairs(languages.map((ln) => [ln, _.fromPairs(namespaces.map((ns) => [ns, locales(ln, ns)]))]))

export function getConfig(ns?: Namespace[]): InitOptions<unknown> {
  return {
    fallbackLng: config.language,
    lng: config.language,
    ns: ns || namespaces,
    resources,
  }
}
