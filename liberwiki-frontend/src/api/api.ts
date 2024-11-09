import _ from 'lodash'

import { paths } from '@/api/schema'
import type { APIQuery, APIType } from '@/api/typeHelpers'
import config from '@/config'
import { removeCookie } from '@/lib/serverActions'
import { getLazyValueAsync } from '@/lib/utils'

import createClient from 'openapi-fetch'

export class LiberWikiAPI {
  config = config.api
  bearerToken: string | null | (() => Promise<string | null>)

  constructor(bearerToken: typeof this.bearerToken) {
    this.bearerToken = bearerToken
  }

  public async isAuthenticated(): Promise<boolean> {
    return !!(await getLazyValueAsync<string | null>(this.bearerToken))
  }

  fetchWrapper = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const bearerToken = await getLazyValueAsync<string | null>(this.bearerToken)

    init = init || {}
    init.headers = (init.headers instanceof Headers ? init.headers : { ...init.headers }) as Record<string, string>

    if (bearerToken) {
      init.headers[config.api.bearerTokenHeaderName] = `${config.api.bearerTokenPrefix} ${bearerToken}`
    }
    init.headers['Content-Type'] = 'application/json'
    init.cache = 'no-cache'
    const response = await fetch(input, init)
    try {
      if (_.isEqual(await response.clone().json(), { detail: 'Invalid token.' })) {
        // I do not like how this check looks, maybe the server should respond with something other than 401
        // Specifically for invalid token error?
        await removeCookie(config.api.bearerTokenCookieName)
      }
    } catch {}
    return response
  }

  // Create the client using the wrapped fetch function
  client = createClient<paths>({
    baseUrl: `${this.config.baseUrl}`,
    headers: {
      'Content-Type': 'application/json',
    },
    fetch: this.fetchWrapper,
  })

  private processQueryResult() {}

  public include(listOfResources: string[]): string {
    // Utility function to use ?include=resource1,resource2,resource3 feature of the api
    return listOfResources.join(',')
  }

  // Below this are api endpoint wrappers
  // In this order:
  // auth
  // users
  // titles
  // entries
  // invites
  public async obtainAuthToken(data: APIType<'AuthTokenRequest'>) {
    return await this.client.POST('/v0/auth/tokens/', { body: data })
  }

  public async deleteAuthToken() {
    return await this.client.DELETE('/v0/auth/tokens/')
  }

  public async signup(data: APIType<'SignupRequest'>) {
    return await this.client.POST('/v0/auth/signup/', { body: data })
  }

  public async verifyEmail(data: APIType<'VerifyEmailRequest'>) {
    return await this.client.POST('/v0/auth/verify-email/', { body: data })
  }

  public async users(filters?: APIQuery<'/v0/users/'>) {
    return await this.client.GET('/v0/users/', { params: { query: filters } })
  }

  public async user(id: string) {
    return await this.client.GET(`/v0/users/{id}/`, { params: { path: { id } } })
  }

  public async me() {
    return await this.client.GET('/v0/users/me/')
  }

  public async putMe(data: APIType<'UserRequest'>) {
    return await this.client.PUT('/v0/users/me/', { body: data })
  }

  public async patchMe(data: APIType<'PatchedUserRequest'>) {
    return await this.client.PATCH('/v0/users/me/', { body: data })
  }

  public async titles(filters?: APIQuery<'/v0/titles/'>) {
    return await this.client.GET('/v0/titles/', { params: { query: filters } })
  }

  public async title(id: string) {
    return await this.client.GET(`/v0/titles/{id}/`, { params: { path: { id } } })
  }

  public async createTitle(data: APIType<'TitleRequest'>) {
    return await this.client.POST('/v0/titles/', { body: data })
  }

  public async deleteTitle(id: string) {
    return await this.client.DELETE(`/v0/titles/{id}/`, { params: { path: { id } } })
  }

  public async bookmarkTitle(id: string) {
    return await this.client.POST(`/v0/titles/{id}/bookmark/`, { params: { path: { id } } })
  }

  public async unbookmarkTitle(id: string) {
    return await this.client.POST(`/v0/titles/{id}/unbookmark/`, { params: { path: { id } } })
  }

  public async entries(filters?: APIQuery<'/v0/entries/'>) {
    return await this.client.GET('/v0/entries/', { params: { query: filters } })
  }

  public async entry(id: string) {
    return await this.client.GET(`/v0/entries/{id}/`, { params: { path: { id } } })
  }

  public async createEntry(data: APIType<'EntryRequest'>) {
    return await this.client.POST('/v0/entries/', { body: data })
  }

  public async putEntry(id: string, data: APIType<'EntryRequest'>) {
    return await this.client.PUT(`/v0/entries/{id}/`, { params: { path: { id } }, body: data })
  }

  public async patchEntry(id: string, data: APIType<'PatchedEntryUpdateRequest'>) {
    return await this.client.PATCH(`/v0/entries/{id}/`, { params: { path: { id } }, body: data })
  }

  public async deleteEntry(id: string) {
    return await this.client.DELETE(`/v0/entries/{id}/`, { params: { path: { id } } })
  }

  public async upvoteEntry(id: string) {
    return await this.client.POST(`/v0/entries/{id}/upvote/`, { params: { path: { id } } })
  }

  public async downvoteEntry(id: string) {
    return await this.client.POST(`/v0/entries/{id}/downvote/`, { params: { path: { id } } })
  }

  public async unvoteEntry(id: string) {
    return await this.client.POST(`/v0/entries/{id}/unvote/`, { params: { path: { id } } })
  }

  public async bookmarkEntry(id: string) {
    return await this.client.POST(`/v0/entries/{id}/bookmark/`, { params: { path: { id } } })
  }

  public async unbookmarkEntry(id: string) {
    return await this.client.POST(`/v0/entries/{id}/unbookmark/`, { params: { path: { id } } })
  }

  public async invites(filters?: APIQuery<'/v0/invitations/'>) {
    return await this.client.GET('/v0/invitations/', { params: { query: filters } })
  }

  public async invite(id: string) {
    return await this.client.GET(`/v0/invitations/{id}/`, { params: { path: { id } } })
  }

  public async createInvite() {
    return await this.client.POST('/v0/invitations/')
  }
}
