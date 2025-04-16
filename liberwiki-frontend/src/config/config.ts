import { booleanConfig, numberConfig, stringConfig } from '~/src/config/parsers'

import _ from 'lodash'

const RAW = Object.freeze({
  membersOnly: process.env.NEXT_PUBLIC_LIBERWIKI__MEMBERS_ONLY,
  debug: process.env.NEXT_PUBLIC_LIBERWIKI__DEBUG,
  name: process.env.NEXT_PUBLIC_LIBERWIKI__NAME,
  domain: process.env.NEXT_PUBLIC_LIBERWIKI__DOMAIN,
  api: {
    baseURL: process.env.NEXT_PUBLIC_LIBERWIKI__API__BASE_URL,
    authBaseURL: process.env.NEXT_PUBLIC_LIBERWIKI__API__AUTH_BASE_URL,
    authCookieAndHeaderPrefix: process.env.NEXT_PUBLIC_LIBERWIKI__APP__AUTH_COOKIE_AND_HEADER_PREFIX,
  },
  language: process.env.NEXT_PUBLIC_LIBERWIKI__LANGUAGE,
  devtools: {
    sentry: {
      debug: process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__DEBUG,
      dsn: process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__DSN,
      tracesSampleRate: process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__TRACES_SAMPLE_RATE,
      replaysSessionSampleRate:
        process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__REPLAYS_SESSION_SAMPLE_RATE,
      replaysOnErrorSampleRate:
        process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__REPLAYS_ON_ERROR_SAMPLE_RATE,
    },
    googleAnalytics: {
      gaID: process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__GOOGLE_ANALYTICS__GA_ID,
    },
  },
  verification: {
    microsoft: {
      associatedApplicationID: process.env.NEXT_PUBLIC_LIBERWIKI__VERIFICATION__MICROSOFT__ASSOCIATED_APPLICATION_ID,
    },
  },
  githubLink: process.env.NEXT_PUBLIC_LIBERWIKI__GITHUB_LINK,
})

const __authCookieAndHeaderPrefix = stringConfig({
  name: 'authCookieAndHeaderPrefix',
  value: RAW.api.authCookieAndHeaderPrefix,
  default: '',
})

const _authCookiePrefix = _.lowerCase(__authCookieAndHeaderPrefix)
const _authHeaderPrefix = _.capitalize(__authCookieAndHeaderPrefix)

export const config = Object.freeze({
  membersOnly: booleanConfig({ name: 'membersOnly', value: RAW.membersOnly, default: false }),
  debug: booleanConfig({ name: 'debug', value: RAW.debug, default: false }),
  name: stringConfig({ name: 'name', value: RAW.name }),
  domain: stringConfig({ name: 'domain', value: RAW.domain }),
  url: `https://${stringConfig({ name: 'domain', value: RAW.domain })}`,
  githubLink: stringConfig({ name: 'githubLink', value: RAW.githubLink, default: '' }),
  api: {
    baseURL: stringConfig({ name: 'api.baseURL', value: RAW.api.baseURL }),
    authBaseURL: stringConfig({ name: 'api.authBaseURL', value: RAW.api.authBaseURL }),
    sessionCookieName: _authCookiePrefix ? `${_authCookiePrefix}_sessionid` : 'sessionid',
    csrfTokenCookieName: _authCookiePrefix ? `${_authCookiePrefix}_csrftoken` : 'csrftoken',
    sessionTokenHeaderName: _authHeaderPrefix ? `X-${_authHeaderPrefix}-Session-Token` : 'X-Session-Token',
    csrfTokenHeaderName: _authHeaderPrefix ? `X-${_authHeaderPrefix}-CSRFToken` : 'X-CSRFToken',
    csrfTokenPostKey: 'csrfmiddlewaretoken',
  },
  ux: {
    defaultTitlePageSize: 50,
    defaultEntryPageSize: 25,
  },
  language: stringConfig({ name: 'language', value: RAW.language, default: 'en' }),
  devtools: {
    sentry: {
      debug: false,
      dsn: stringConfig({ name: 'sentry.dsn', value: RAW.devtools.sentry.dsn, default: '' }),
      tracesSampleRate: numberConfig({
        name: 'sentry.tracesSampleRate',
        value: RAW.devtools.sentry.tracesSampleRate,
        default: 0,
      }),
      replaysSessionSampleRate: numberConfig({
        name: 'sentry.replaysSessionSampleRate',
        value: RAW.devtools.sentry.replaysSessionSampleRate,
        default: 0,
      }),
      replaysOnErrorSampleRate: numberConfig({
        name: 'sentry.replaysOnErrorSampleRate',
        value: RAW.devtools.sentry.replaysOnErrorSampleRate,
        default: 0,
      }),
    },
    googleAnalytics: {
      gaID: stringConfig({ name: 'googleAnalytics.gaID', value: RAW.devtools.googleAnalytics.gaID, default: '' }),
    },
  },
  verification: {
    microsoft: {
      associatedApplicationID: stringConfig({
        name: 'verification.microsoft.associatedApplicationID',
        value: RAW.verification.microsoft.associatedApplicationID,
        default: '',
      }),
    },
  },
})
