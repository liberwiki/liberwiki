export const config = {
  exampleLink: 'http://example.com',
  name: process.env.NEXT_PUBLIC_LIBERWIKI__NAME,
  api: {
    baseUrl: process.env.NEXT_PUBLIC_LIBERWIKI__API__BASE_URL,
    bearerTokenCookieName: 'BearerToken',
    bearerTokenHeaderName: 'Authorization',
    bearerTokenPrefix: 'Token',
  },
  ux: {
    defaultTitlePageSize: 50,
    defaultEntryPageSize: 25,
  },
  membersOnly: true,
  language: process.env.NEXT_PUBLIC_LIBERWIKI__LANGUAGE || 'en',
  devtools: {
    sentry: {
      debug: false,
      dsn: process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__DSN,
      tracesSampleRate: Number(process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__TRACES_SAMPLE_RATE),
      replaysSessionSampleRate: Number(
        process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__REPLAYS_SESSION_SAMPLE_RATE
      ),
      replaysOnErrorSampleRate: Number(
        process.env.NEXT_PUBLIC_LIBERWIKI__FRONT_END__DEVTOOLS__SENTRY__REPLAYS_ON_ERROR_SAMPLE_RATE
      ),
    },
  },
}