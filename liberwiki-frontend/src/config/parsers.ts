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

export function numberConfig(value: string | undefined, default_?: number): number {
  if (value === undefined || value === '') {
    if (default_ === undefined) {
      throw new Error('Value is required.')
    }
    return default_
  }

  const numberValue = Number(value)
  if (isNaN(numberValue)) {
    throw new Error(`Value "${value}" cannot be parsed into a number.`)
  }
  return numberValue
}

export function stringConfig(value: string | undefined, default_?: string): string {
  if (value === undefined || value === '') {
    if (default_ === undefined) {
      throw new Error('Value is required.')
    }
    return default_
  }
  return value
}
