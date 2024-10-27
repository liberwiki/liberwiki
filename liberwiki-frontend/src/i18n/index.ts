// Types for useClientTranslation and sUseTranslation sucks,
// I made up basic types for namespaces that only validates the namespaces in useTranslation hook
// but returned t doesn't validate the namespaces
// so the code below passes type checks even though it shouldn't
// const { translate } = useClientTranslation(['common'])
// translate('no:no') // this should fail but it doesn't
// @TODO: fix i18n types

export { useTranslation as useClientTranslation } from './client'
export { useTranslation as sUseTranslation } from './server'
