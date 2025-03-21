import { LiberWikiAuthAPI } from '@/api/authApi'
import { paths } from '@/api/schema'
import type { APIQuery, APIType } from '@/api/typeHelpers'
import config from '@/config'
import { getLazyValueAsync, setKeyValueToObjectIfValue } from '@/lib/utils'

import createClient from 'openapi-fetch'

export class LiberWikiAPI {
  config = config.api
  sessionToken: string | null | (() => Promise<string | null>)
  csrfToken: string | null | (() => Promise<string | null>)
  auth: LiberWikiAuthAPI

  constructor(sessionToken: typeof this.sessionToken, csrfToken: typeof this.csrfToken) {
    this.sessionToken = sessionToken
    this.csrfToken = csrfToken
    this.auth = new LiberWikiAuthAPI(this.fetch)
  }

  isAuthenticated = async () => {
    const { response } = await this.auth.session()
    return response?.ok
  }

  getCurrentUser = async (): Promise<APIType<'User'> | undefined> => {
    const { data: userData } = await this.me()
    return userData
  }

  fetch = async (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
    const sessionToken = await getLazyValueAsync<string | null>(this.sessionToken)
    const csrfToken = await getLazyValueAsync<string | null>(this.csrfToken)

    init = init || {}
    init.headers = (init.headers instanceof Headers ? init.headers : { ...init.headers }) as Record<string, string>

    setKeyValueToObjectIfValue(config.api.sessionTokenHeaderName, sessionToken, init.headers)
    setKeyValueToObjectIfValue(config.api.csrfTokenHeaderName, csrfToken, init.headers)

    init.headers['Content-Type'] = 'application/json'
    init.credentials = 'include'
    return await fetch(input, init)
  }

  // Create the client using the wrapped fetch function
  client = createClient<paths>({
    baseUrl: `${this.config.baseURL}`,
    headers: {
      'Content-Type': 'application/json',
    },
    fetch: this.fetch,
  })

  public include(listOfResources: string[]): string {
    // Utility function to use ?include=resource1,resource2,resource3 feature of the api
    return listOfResources.join(',')
  }

  public hasResults(
    resource: undefined | { results: { length: number } }
  ): resource is { results: { length: number } } {
    return !!resource && resource.results.length > 0
  }

  public hasNoResult(resource: undefined | { results: { length: number } }) {
    return resource && (resource.results.length || 0) === 0
  }

  // Below this are api endpoint wrappers
  // In this order:
  // users
  // titles
  // entries
  // invites

  public async users(filters?: APIQuery<'/v0/users/'>) {
    return await this.client.GET('/v0/users/', { params: { query: filters } })
  }

  public async user(id: string, query?: APIQuery<'/v0/users/{id}/'>) {
    return await this.client.GET(`/v0/users/{id}/`, { params: { path: { id }, query } })
  }

  public async me(query?: APIQuery<'/v0/users/me/'>) {
    return await this.client.GET('/v0/users/me/', { params: { query } })
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

  public async title(id: string, query?: APIQuery<'/v0/titles/{id}/'>) {
    return await this.client.GET(`/v0/titles/{id}/`, { params: { path: { id }, query } })
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

  public async entry(id: string, query?: APIQuery<'/v0/entries/{id}/'>) {
    return await this.client.GET(`/v0/entries/{id}/`, { params: { path: { id }, query } })
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

  public async invite(id: string, query?: APIQuery<'/v0/invitations/{id}/'>) {
    return await this.client.GET(`/v0/invitations/{id}/`, { params: { path: { id }, query } })
  }

  public async createInvite() {
    return await this.client.POST('/v0/invitations/')
  }
}
