import aciksozlukTailwindConfig from '~/tailwind.config'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import resolveConfig from 'tailwindcss/resolveConfig'

export const tailwindConfig = resolveConfig(aciksozlukTailwindConfig)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// We don't care about the function, we are just passing some attributes to it to be used
// by namespacing the function itself rather than having to create a class or some similar structure
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function withAttributes<T extends Record<string, string>>(fn: Function, attributes: T): Function & T {
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
  // I hate writing () => someFunction(data) for everything that nees a function
  // This utility allows me to turn
  // <SomeComponent onClick={() => someFunction(data))} />
  // into
  // <SomeComponent onClick={makeCallable(someFunction)(data)} />
  return (data: T) => () => originalCallable(data)
}
