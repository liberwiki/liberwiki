import { AcikSozlukApi } from '@/api'
import config from '@/config/config'
import { getCookie } from '@/lib/serverActions'

export function useAcikSozlukAPI() {
  return new AcikSozlukApi(() => getCookie(config.api.bearerTokenCookieName) || null)
}
