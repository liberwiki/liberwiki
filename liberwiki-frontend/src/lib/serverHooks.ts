import { LiberWikiAPI } from '@/api'
import config from '@/config'
import { getCookie } from '@/lib/serverActions'

export function useLiberWikiAPI() {
  return new LiberWikiAPI(
    () => getCookie(config.api.sessionCookieName) || null,
    () => getCookie(config.api.csrfTokenCookieName) || null
  )
}
