// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'

import config from '@/config'

Sentry.init({
  dsn: config.devtools.sentry.dsn,
  tracesSampleRate: config.devtools.sentry.tracesSampleRate,
  replaysSessionSampleRate: config.devtools.sentry.replaysSessionSampleRate,
  replaysOnErrorSampleRate: config.devtools.sentry.replaysOnErrorSampleRate,
  debug: config.devtools.sentry.debug,
})
