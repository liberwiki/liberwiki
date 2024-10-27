import { components, paths } from '@/api/schema'

import { UseQueryOptions } from '@tanstack/react-query'
import { FetchResponse } from 'openapi-fetch'
import type { MediaType } from 'openapi-typescript-helpers'

export type APIQuery<T extends keyof paths> = paths[T] extends { get: { parameters: { query?: infer Q } } } ? Q : never
export type APIResponse<T extends keyof paths, TMethod extends keyof paths[T]> = paths[T][TMethod]
export type RemainingUseQueryOptions<T extends keyof paths> = Omit<
  UseQueryOptions<FetchResponse<APIResponse<T, 'get'>, unknown, MediaType>>,
  'queryKey' | 'queryFn'
>
export type APIType<T extends keyof components['schemas']> = components['schemas'][T]
export type Includes<T, K extends keyof T, F> = Omit<T, K> & { [P in K]: F }

export function includesType<T extends object, K extends keyof T, S extends keyof components['schemas']>(
  obj: T,
  _key: K,
  _type: S
): Includes<T, K, APIType<S>> {
  /**
   * This function is a type assertion function that allows you to assert
   * that a property of an object is of a certain type.
   */

  // Usage example:
  // entry = fetch_entry({include: author}) # The entry object has author because of the include
  // But because openapi schema doesn't support dynamically changing the return types depending on path params
  // TS thinks it is a string uuid
  // we can do
  // entry = includesType(entry, 'author', 'Author') which automagically changes the type of entry.author to Author
  return obj as unknown as Includes<T, K, APIType<S>>
}
