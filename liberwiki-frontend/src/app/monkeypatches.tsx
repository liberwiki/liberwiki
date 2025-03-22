'use client'

import { useEffect } from 'react'

import { globalLiberWikiAPI, noDirectConsoleLog } from '@/lib/monkeypatches'

export default function MonkeyPatches() {
  useEffect(() => {
    noDirectConsoleLog(window)
    globalLiberWikiAPI(window)
    window.liberwiki.auth.session() // Fetch the necessary CSRF token and session cookie during initial page load
  })

  return null
}
