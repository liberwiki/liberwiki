export default {
  locales: ['en', 'tr'],
  lexers: {
    ts: ['JavascriptLexer'],
    tsx: ['JsxLexer'],
  },
  localeDetection: false,
  react: {
    useSuspense: false,
  },
  createOldCatalogs: false,
}
