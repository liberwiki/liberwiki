import { booleanConfig, numberConfig, stringConfig } from '~/src/config/parsers'

export const config = {
  debug: booleanConfig(process.env.NEXT_PUBLIC_LIBERWIKI__DEBUG, false),
  name: stringConfig(process.env.NEXT_PUBLIC_LIBERWIKI__NAME),
  domain: stringConfig(process.env.NEXT_PUBLIC_LIBERWIKI__DOMAIN),
  api: {
    baseUrl: stringConfig(process.env.NEXT_PUBLIC_LIBERWIKI__API__BASE_URL),
    bearerTokenCookieName: 'BearerToken',
    bearerTokenHeaderName: 'Authorization',
    bearerTokenPrefix: 'Token',
  },
  ux: {
    defaultTitlePageSize: 50,
    defaultEntryPageSize: 25,
  },
  membersOnly: booleanConfig(process.env.NEXT_PUBLIC_LIBERWIKI__MEMBERS_ONLY, true),
  language: stringConfig(process.env.NEXT_PUBLIC_LIBERWIKI__LANGUAGE, 'en'),
  devtools: {
    sentry: {
      debug: false,
      dsn: stringConfig(process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__DSN),
      tracesSampleRate: numberConfig(
        process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__TRACES_SAMPLE_RATE
      ),
      replaysSessionSampleRate: numberConfig(
        process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__REPLAYS_SESSION_SAMPLE_RATE
      ),
      replaysOnErrorSampleRate: numberConfig(
        process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__REPLAYS_ON_ERROR_SAMPLE_RATE
      ),
    },
    googleAnalytics: {
      gaID: stringConfig(process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__GOOGLE_ANALYTICS__GA_ID, ''),
    },
  },
}
