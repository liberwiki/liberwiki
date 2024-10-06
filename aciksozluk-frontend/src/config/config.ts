const config = {
  exampleLink: 'http://example.com',
  name: 'ACIKSOZLUK', // process.env.ACIKSOZLUK__NAME,
  api: {
    baseUrl: 'http://aciksozluk.org:80', // process.env.ACIKSOZLUK__DOMAIN,
    bearerTokenCookieName: 'BearerToken',
    bearerTokenHeaderName: 'Authorization',
    bearerTokenPrefix: 'Token',
  },
  ux: {
    defaultTitlePageSize: 50,
    defaultEntryPageSize: 25,
  },
}

export default config
