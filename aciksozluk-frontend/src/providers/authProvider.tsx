'use client'

import { ReactNode, createContext, useContext } from 'react'

import { APIType } from '@/api/typeHelpers'
import { useAcikSozlukAPI } from '@/lib/serverHooks'

interface AuthContextType {
  user?: APIType<'User'> | undefined
}

const AuthContext = createContext<AuthContextType>({})

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const aciksozluk = useAcikSozlukAPI()
  const { data: me } = aciksozluk.me()

  return <AuthContext.Provider value={{ user: me || undefined }}>{children}</AuthContext.Provider>
}
