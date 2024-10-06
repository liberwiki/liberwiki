import _ from 'lodash'

import { components, paths } from '@/api/schema'
import config from '@/config/config'
import { getLazyValueAsync } from '@/lib/utils'

import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query'
import createClient, { FetchResponse } from 'openapi-fetch'
import type { MediaType } from 'openapi-typescript-helpers'

export class AcikSozlukApi {
  config = config.api
  bearerToken: string | null | (() => Promise<string | null>) | (() => string | null)

  constructor(bearerToken: typeof this.bearerToken) {
    this.bearerToken = bearerToken
  }

  fetchWrapper = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const bearerToken = await getLazyValueAsync<string | null>(this.bearerToken)

    init = init || {}
    init.headers = (init.headers instanceof Headers ? init.headers : { ...init.headers }) as Record<string, string>

    if (bearerToken) {
      init.headers[config.api.bearerTokenHeaderName] = `${config.api.bearerTokenPrefix} ${bearerToken}`
    }
    init.headers['Content-Type'] = 'application/json'

    try {
      return await fetch(input, init)
    } catch (error) {
      return new Response(
        JSON.stringify({
          message: `${error}`,
        }),
        {
          status: 500,
          statusText: 'Network Error',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }

  // Create the client using the wrapped fetch function
  client = createClient<paths>({
    baseUrl: this.config.baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    fetch: this.fetchWrapper,
  })

  private processQueryResult<T, O, M extends MediaType>(queryResult: UseQueryResult<FetchResponse<T, O, M>>) {
    return {
      data: queryResult?.data?.data,
      response: queryResult?.data?.response,
      ..._.omit(queryResult, 'data'),
    }
  }

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
  public obtainAuthToken = () => {
    return useMutation({
      mutationKey: ['obtainAuthToken'],
      mutationFn: (data: components['schemas']['AuthTokenRequest']) =>
        this.client.POST('/api/v0/auth/tokens/', { body: data }),
    })
  }

  public deleteAuthToken = () => {
    return useMutation({
      mutationKey: ['deleteAuthToken'],
      mutationFn: () => this.client.DELETE('/api/v0/auth/tokens/'),
    })
  }

  public users = (filters?: paths['/api/v0/users/']['get']['parameters']['query']) => {
    const queryResult = useQuery({
      queryKey: ['users', filters],
      queryFn: () => this.client.GET('/api/v0/users/', { params: { query: filters } }),
    })
    return this.processQueryResult(queryResult)
  }

  public user = (id: string) => {
    const queryResult = useQuery({
      queryKey: ['user', id],
      queryFn: () => this.client.GET(`/api/v0/users/{id}/`, { params: { path: { id } } }),
    })
    return this.processQueryResult(queryResult)
  }

  public me = () => {
    const queryResult = useQuery({
      queryKey: ['me'],
      queryFn: () => this.client.GET('/api/v0/users/me/'),
    })
    return this.processQueryResult(queryResult)
  }

  public putMe = () => {
    return useMutation({
      mutationKey: ['putMe'],
      mutationFn: (data: components['schemas']['UserRequest']) => this.client.PUT('/api/v0/users/me/', { body: data }),
    })
  }

  public patchMe = () => {
    return useMutation({
      mutationKey: ['patchMe'],
      mutationFn: (data: components['schemas']['PatchedUserRequest']) =>
        this.client.PATCH('/api/v0/users/me/', { body: data }),
    })
  }

  public titles = (filters?: paths['/api/v0/titles/']['get']['parameters']['query']) => {
    const queryResult = useQuery({
      queryKey: ['titles', filters],
      queryFn: () => this.client.GET('/api/v0/titles/', { params: { query: filters } }),
    })
    return this.processQueryResult(queryResult)
  }

  public title = (id: string) => {
    const queryResult = useQuery({
      queryKey: ['title', id],
      queryFn: () => this.client.GET(`/api/v0/titles/{id}/`, { params: { path: { id } } }),
    })
    return this.processQueryResult(queryResult)
  }

  public createTitle = () => {
    return useMutation({
      mutationKey: ['createTitle'],
      mutationFn: (data: components['schemas']['TitleRequest']) => this.client.POST('/api/v0/titles/', { body: data }),
    })
  }

  public deleteTitle = (id: string) => {
    return useMutation({
      mutationKey: ['deleteTitle', id],
      mutationFn: () => this.client.DELETE(`/api/v0/titles/{id}/`, { params: { path: { id } } }),
    })
  }

  public entries = (filters?: paths['/api/v0/entries/']['get']['parameters']['query']) => {
    const queryResult = useQuery({
      queryKey: ['entries', filters],
      queryFn: () => this.client.GET('/api/v0/entries/', { params: { query: filters } }),
    })
    return this.processQueryResult(queryResult)
  }

  public entry = (id: string) => {
    const queryResult = useQuery({
      queryKey: ['entry', id],
      queryFn: () => this.client.GET(`/api/v0/entries/{id}/`, { params: { path: { id } } }),
    })
    return this.processQueryResult(queryResult)
  }

  public createEntry = () => {
    return useMutation({
      mutationKey: ['createEntry'],
      mutationFn: (data: components['schemas']['EntryRequest']) => this.client.POST('/api/v0/entries/', { body: data }),
    })
  }

  public putEntry = (id: string) => {
    return useMutation({
      mutationKey: ['putEntry', id],
      mutationFn: (data: components['schemas']['EntryRequest']) =>
        this.client.PUT(`/api/v0/entries/{id}/`, { params: { path: { id } }, body: data }),
    })
  }

  public patchEntry = (id: string) => {
    return useMutation({
      mutationKey: ['patchEntry', id],
      mutationFn: (data: components['schemas']['EntryRequest']) =>
        this.client.PATCH(`/api/v0/entries/{id}/`, { params: { path: { id } }, body: data }),
    })
  }

  public deleteEntry = (id: string) => {
    return useMutation({
      mutationKey: ['deleteEntry', id],
      mutationFn: () => this.client.DELETE(`/api/v0/entries/{id}/`, { params: { path: { id } } }),
    })
  }
}
