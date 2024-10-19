'use client'

import { ReactNode, createContext, useContext } from 'react'

import { APIType } from '@/api/typeHelpers'
import { useAcikSozlukAPI } from '@/lib/serverHooks'

interface AuthContextType {
  user: APIType<'User'> | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const aciksozluk = useAcikSozlukAPI()
  const { data: me } = aciksozluk.me()

  return <AuthContext.Provider value={{ user: me || null }}>{children}</AuthContext.Provider>
}
