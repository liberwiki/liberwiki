'use client'

import { useEffect } from 'react'

import { globalLiberWikiAPI, noDirectConsoleLog } from '@/lib/monkeypatches'

export default function MonkeyPatches() {
  useEffect(() => {
    noDirectConsoleLog(window)
    globalLiberWikiAPI(window)
  })

  return null
}
