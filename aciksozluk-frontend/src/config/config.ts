export const config = {
  exampleLink: 'http://example.com',
  name: process.env.NEXT_PUBLIC__ACIKSOZLUK__NAME,
  api: {
    baseUrl: process.env.NEXT_PUBLIC__ACIKSOZLUK__API__BASE_URL,
    bearerTokenCookieName: 'BearerToken',
    bearerTokenHeaderName: 'Authorization',
    bearerTokenPrefix: 'Token',
  },
  ux: {
    defaultTitlePageSize: 50,
    defaultEntryPageSize: 25,
  },
  membersOnly: true,
}
