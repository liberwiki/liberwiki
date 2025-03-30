import { isDynamicServerError } from 'next/dist/client/components/hooks-server-context'

import type { AuthApiSessionType } from '@/api/authApiTypes'
import config from '@/config'
import { checkRequiredKeys } from '@/lib/utils'

export class LiberWikiAuthAPI {
  APIConfig = config.api
  _fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  socialAuthFormAction = `${this.APIConfig.authBaseURL}/auth/provider/redirect`

  constructor(fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {
    this._fetch = fetch
  }

  fetch = async (
    input: RequestInfo,
    init?: RequestInit | undefined
  ): Promise<{ response?: Response; data?: Record<string, unknown>; error?: unknown }> => {
    input = `${this.APIConfig.authBaseURL}${input}`
    let response
    let data
    let error = null
    try {
      response = await this._fetch(input, init)
      const responseData = (await response.json()) as Record<string, unknown>
      if (response.ok) {
        data = responseData
      } else {
        error = responseData
      }
    } catch (err) {
      if (isDynamicServerError(err)) {
        throw err
      }
      // Server error, we should handle this generically here
      console.error(err)
    }
    return Promise.resolve({ response, data, error })
  }

  // Below are the untyped allauth API endpoints

  public async config() {
    return await this.fetch('/config')
  }

  public async session(): AuthApiSessionType {
    return (await this.fetch('/auth/session')) as AuthApiSessionType
  }

  public async signup(data: { username: string; email: string; password: string }) {
    return await this.fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  public async login(data: { username?: string; email?: string; password: string }) {
    checkRequiredKeys(data, { emailLogin: ['email', 'password'], usernameLogin: ['username', 'password'] })
    return await this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  public async logout() {
    return await this.fetch('/auth/session', {
      method: 'DELETE',
    })
  }

  public async requestPasswordReset(data: { email: string }) {
    return await this.fetch('/auth/password/request', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  public async resetPassword(data: { current_password: string; new_password: string }) {
    return await this.fetch('/account/password/change', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  public async resetUnusablePassword(data: { new_password: string }) {
    return await this.fetch('/account/password/change', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  public async resetPasswordWithKey(data: { key: string; password: string }) {
    return await this.fetch('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  public async connections() {
    return await this.fetch('/account/providers')
  }

  public async removeConnection(data: { provider: string; account: string }) {
    return await this.fetch('/account/providers', {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  }

  public async emails() {
    return await this.fetch('/account/email')
  }

  public async addEmail(data: { email: string }) {
    return await this.fetch('/account/email', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  public async removeEmail(data: { email: string }) {
    return await this.fetch('/account/email', {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  }

  public async resendVerificationEmail(data: { email: string }) {
    return await this.fetch('/account/email', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  public async verifyEmail(data: { key: string }) {
    return await this.fetch('/auth/email/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  public async markEmailPrimary(data: { email: string }) {
    return await this.fetch('/account/email', {
      method: 'PATCH',
      body: JSON.stringify({ ...data, primary: true }),
    })
  }
}
