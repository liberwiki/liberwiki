type Config<T> = {
  name: string
  value: T | undefined | string
  default?: T
}

export function booleanConfig(config: Config<boolean>): boolean {
  const truthyValues = ['true', '1']
  const falsyValues = ['false', '0']

  const stringValue = String(config.value).toLowerCase()

  if (truthyValues.includes(stringValue)) {
    return true
  } else if (falsyValues.includes(stringValue)) {
    return false
  } else if (config.default !== undefined) {
    return config.default
  } else {
    throw new Error(`Value "${config.value}" cannot be parsed into a boolean. Please provide a valid "${config.name}"`)
  }
}

export function numberConfig(config: Config<number>): number {
  if (config.value === undefined || config.value === '') {
    if (config.default === undefined) {
      throw new Error(`Value is required for "${config.name}"."`)
    }
    return config.default
  }

  const numberValue = Number(config.value)
  if (isNaN(numberValue)) {
    throw new Error(`Value "${config.value}" cannot be parsed into a number. Please provide a valid "${config.name}"`)
  }
  return numberValue
}

export function stringConfig(config: Config<string>): string {
  if (config.value === undefined || config.value === '') {
    if (config.default === undefined) {
      throw new Error(`Value is required for "${config.name}"`)
    }
    return config.default
  }
  return config.value
}
