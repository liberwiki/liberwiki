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
  sort: true,
  createOldCatalogs: false,
}

export default i18nextParserConfig
