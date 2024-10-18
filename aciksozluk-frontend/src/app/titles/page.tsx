'use client'

import _ from 'lodash'

import Title from '@/components/aciksozluk/Title'

import { includesType } from '@/api'
import { useAcikSozlukAPI } from '@/lib/serverHooks'

export default function TitlePage() {
  const aciksozluk = useAcikSozlukAPI()

  const { data: entries, isSuccess } = aciksozluk.entries({
    page_size: 1,
    page: 1,
    ordering: '-created_at',
    include: 'title',
  })

  const firstEntry = _.first(entries?.results)
  const entry = firstEntry && includesType(firstEntry, 'title', 'Title')

  return isSuccess && entry && <Title title={entry.title} />
}
