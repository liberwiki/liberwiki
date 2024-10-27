'use client'

import { ReactNode, createContext, useContext } from 'react'

import { APIType } from '@/api/typeHelpers'
import { useLiberWikiAPI } from '@/lib/serverHooks'

interface AuthContextType {
  user?: APIType<'User'> | undefined
}

const AuthContext = createContext<AuthContextType>({})

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const liberwiki = useLiberWikiAPI()
  const { data: me } = liberwiki.me()

  return <AuthContext.Provider value={{ user: me || undefined }}>{children}</AuthContext.Provider>
}
