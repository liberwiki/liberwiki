const i18nextParserConfig = {
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

export default i18nextParserConfig
