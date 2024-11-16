export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>

export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> }
