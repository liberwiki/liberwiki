export function booleanConfig(value: string | undefined, default_?: boolean): boolean {
  const truthyValues = ['true', '1']
  const falsyValues = ['false', '0']

  const stringValue = String(value).toLowerCase()

  if (truthyValues.includes(stringValue)) {
    return true
  } else if (falsyValues.includes(stringValue)) {
    return false
  } else if (default_ !== undefined) {
    return default_
  } else {
    throw new Error(`Value "${value}" cannot be parsed into a boolean.`)
  }
}
