import liberwikiTailwindConfig from '~/tailwind.config'

import { NextRequest, NextResponse } from 'next/server'

import _ from 'lodash'

import { LONG_DATE_FORMAT, SHORT_DATE_FORMAT } from '@/lib/constants'

import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import resolveConfig from 'tailwindcss/resolveConfig'

export const tailwindConfig = resolveConfig(liberwikiTailwindConfig)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// We don't care about the function, we are just passing some attributes to it to be used
// by namespacing the function itself rather than having to create a class or some similar structure
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function withAttributes<T extends Record<string, string | boolean | Function | number>>(
  fn: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  attributes: T
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
): Function & T {
  Object.keys(attributes).forEach((key) => {
    // Usage
    //
    //  const myFunction = assignAttributesToFunction(function() {}, {"foo": "bar"})
    //  myFunction.foo // TS successfully detects that foo is a string
    //  myFunction.baz // TS successfully figures baz doesn't exist on the returned function
    //
    // This type error is contained only within this function, so it actually works perfectly
    // @ts-ignore
    fn[key] = attributes[key]
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return fn as Function & T
}

export function makeCallable<T, R>(originalCallable: (arg: T) => R) {
  // Usage
  //
  // I hate writing () => someFunction(data) for everything that needs a function
  // This utility allows me to turn
  // <SomeComponent onClick={() => someFunction(data))} />
  // into
  // <SomeComponent onClick={makeCallable(someFunction)(data)} />
  return (data: T) => () => originalCallable(data)
}

export function slugify(value: string, allowUnicode: boolean = false): string {
  /**
   * Convert to ASCII if 'allowUnicode' is false. Convert spaces or repeated
   * dashes to single dashes. Remove characters that aren't alphanumerics,
   * underscores, or hyphens. Convert to lowercase. Also strip leading and
   * trailing whitespace, dashes, and underscores.
   */
  // Django's slugify function ported to typescript, so we can save some api calls.
  if (allowUnicode) {
    value = value.normalize('NFKC')
  } else {
    value = value
      .normalize('NFKD')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/[\r\n]+/g, '')
      .trim()
  }

  value = value.replace(/[^\w\s-]/g, '').toLowerCase()

  return value.replace(/[-\s]+/g, '-').replace(/^[-_]+|[-_]+$/g, '')
}

export function checkRequiredKeys<T extends Record<string, unknown>, C extends Record<string, Array<keyof T>>>(
  obj: T,
  conditions: C
): keyof C {
  /**
   * Check if the object has exactly one of the required key groups.
   * Used when a function can take multiple different sets of arguments but only some of them make sense together.
   * For instance, a function that can take either "a" or "b and c" but not both at the same time, and at least one set is required.
   **/
  // Usage
  //
  // const obj1 = { a: 1, b: undefined, c: undefined, d: undefined, e: undefined };
  // const obj2 = { a: undefined, b: 1, c: 2, d: undefined, e: undefined };
  // const obj3 = { a: undefined, b: undefined, c: undefined, d: 1, e: 2 };
  // const conditions = {
  //   conditionName: ["a"],
  //   condition2Name: ["b", "c"],
  //   condition3Name: ["d", "e"]
  // };
  //
  // checkRequiredKeys(obj1, conditions); // "conditionName"
  // checkRequiredKeys(obj2, conditions); // "condition2Name"
  // checkRequiredKeys(obj3, conditions); // "condition3Name"
  // checkRequiredKeys({ a: 1, b: 2, c: 3 }, conditions); // Throws error

  const matchingConditions = Object.entries(conditions).filter(
    ([_, keys]) =>
      keys.every((key) => obj[key] !== undefined) &&
      Object.keys(obj).every((key) => keys.includes(key as keyof T) || obj[key] === undefined)
  )

  if (matchingConditions.length !== 1) {
    throw new Error(`Object keys do not match exactly one required condition. ${JSON.stringify(conditions)}`)
  }

  return matchingConditions[0][0] as keyof C
}

export function getLazyValue<T>(input: T | (() => T)) {
  /**
   * Get the value of a lazy value, which can be either a function or a value.
   */
  if (typeof input === 'function') {
    return (input as () => T)()
  }
  return input
}

export async function getLazyValueAsync<T>(input: T | (() => Promise<T>) | (() => T)) {
  /**
   * Get the value of a lazy value, which can be either a function, an async function or a value.
   */
  if (typeof input === 'function') {
    const result = (input as () => Promise<T>)()
    if (result instanceof Promise) {
      return await result
    }
    return result
  }
  return input
}

export function runMiddlewareIfPathMatches(path: RegExp, exemptNextPaths: boolean = true) {
  return function (middleware: (request: NextRequest) => Promise<NextResponse | void>) {
    return async function (request: NextRequest) {
      const nextPatterns = [/^\/_next/]
      const wellKnownPatterns = [/^\/.well-known/]
      const publicPatterns = [
        // TODO: read the src/public directory and generate this list
        /android-chrome-192x192.png/,
        /android-chrome-512x512.png/,
        /apple-touch-icon.png/,
        /favicon.ico/,
        /favicon-16x16.png/,
        /favicon-32x32.png/,
        /robots.txt/,
        /humans.txt/,
        /site.webmanifest/,
      ]

      const ignoredPatterns = [...nextPatterns, ...wellKnownPatterns, ...publicPatterns]

      if (exemptNextPaths && _.some(ignoredPatterns, (pattern) => pattern.test(request.nextUrl.pathname))) {
        return
      }

      if (path.test(request.nextUrl.pathname)) {
        return await middleware(request)
      }
    }
  }
}

export function formattedDate(dateFormat: string, date?: Date) {
  return format(date || new Date(), dateFormat)
}

export function longFormattedDate(date?: Date) {
  return formattedDate(LONG_DATE_FORMAT, date || new Date())
}

export function shortFormattedDate(date?: Date) {
  return formattedDate(SHORT_DATE_FORMAT, date || new Date())
}

export function optionalDate(date?: string) {
  return date ? new Date(date) : undefined
}

export function preventDefault<T extends (event: Event) => unknown>(callable: T): T {
  return async function (event: Event) {
    event.preventDefault()
    return await callable(event)
  } as T
}
