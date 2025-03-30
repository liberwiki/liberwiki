export type AuthApiSessionType = Promise<{
  response?: Response
  data?: {
    status: number
    data: {
      user: {
        display: string
        has_usable_password: boolean
        id: string
        email: string
        username: string
        signup_completed: boolean
      }
      methods: string[] // This is a list of authentication methods, @TODO: replace this with a string enum
    }
    meta: {
      is_authenticated: boolean
    }
  }
  error?: unknown
}>
