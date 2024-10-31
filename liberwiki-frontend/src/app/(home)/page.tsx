'use client'

import _ from 'lodash'

import Title from '@/components/liberwiki/Title'

import { includesType } from '@/api'
import { useLiberWikiAPI } from '@/lib/serverHooks'

export default function Home() {
  const liberwiki = useLiberWikiAPI()

  const { data: entries, isSuccess } = liberwiki.entries({
    page_size: 1,
    page: 1,
    ordering: '-created_at',
    include: 'title',
  })

  const firstEntry = _.first(entries?.results)
  const entry = firstEntry && includesType(firstEntry, 'title', 'Title')

  return isSuccess && entry && <Title title={entry.title} />
}
