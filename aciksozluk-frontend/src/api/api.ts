import { components, paths } from '@/api/schema'
import config from '@/config/config'

import createClient from 'openapi-fetch'

class AcikSozlukApi {
  config = config.api

  fetchWrapper = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
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
    fetch: this.fetchWrapper, // Use the wrapped fetch function
  })

  public include(listOfResources: string[]): string {
    // Utility function to use ?include=resource1,resource2,resource3 feature of the api
    return listOfResources.join(',')
  }

  // Below this are api endpoint wrappers
  // In this order:
  // users
  // titles
  // entries
  public users = async (filters?: paths['/api/v0/users/']['get']['parameters']['query']) => {
    return this.client.GET('/api/v0/users/', { params: { query: filters } })
  }

  public user = async (id: string) => {
    return this.client.GET(`/api/v0/users/{id}/`, { params: { path: { id } } })
  }

  public me = async () => {
    return this.client.GET('/api/v0/users/me/')
  }

  public putMe = async (data: components['schemas']['UserRequest']) => {
    return this.client.PUT('/api/v0/users/me/', { body: data })
  }

  public patchMe = async (data: components['schemas']['UserRequest']) => {
    return this.client.PATCH('/api/v0/users/me/', { body: data })
  }

  public titles = async (filters?: paths['/api/v0/titles/']['get']['parameters']['query']) => {
    return this.client.GET('/api/v0/titles/', { params: { query: filters } })
  }

  public title = async (id: string) => {
    return this.client.GET(`/api/v0/titles/{id}/`, { params: { path: { id } } })
  }

  public createTitle = async (data: components['schemas']['TitleRequest']) => {
    return this.client.POST('/api/v0/titles/', { body: data })
  }

  public putTitle = async (id: string, data: components['schemas']['TitleRequest']) => {
    return this.client.PUT(`/api/v0/titles/{id}/`, { params: { path: { id } }, body: data })
  }

  public patchTitle = async (id: string, data: components['schemas']['TitleRequest']) => {
    return this.client.PATCH(`/api/v0/titles/{id}/`, { params: { path: { id } }, body: data })
  }

  public deleteTitle = async (id: string) => {
    return this.client.DELETE(`/api/v0/titles/{id}/`, { params: { path: { id } } })
  }

  public entries = async (filters?: paths['/api/v0/entries/']['get']['parameters']['query']) => {
    return this.client.GET('/api/v0/entries/', { params: { query: filters } })
  }

  public entry = async (id: string) => {
    return this.client.GET(`/api/v0/entries/{id}/`, { params: { path: { id } } })
  }

  public createEntry = async (data: components['schemas']['EntryRequest']) => {
    return this.client.POST('/api/v0/entries/', { body: data })
  }

  public putEntry = async (id: string, data: components['schemas']['EntryRequest']) => {
    return this.client.PUT(`/api/v0/entries/{id}/`, { params: { path: { id } }, body: data })
  }

  public patchEntry = async (id: string, data: components['schemas']['EntryRequest']) => {
    return this.client.PATCH(`/api/v0/entries/{id}/`, { params: { path: { id } }, body: data })
  }

  public deleteEntry = async (id: string) => {
    return this.client.DELETE(`/api/v0/entries/{id}/`, { params: { path: { id } } })
  }
}

export const aciksozluk = new AcikSozlukApi()
