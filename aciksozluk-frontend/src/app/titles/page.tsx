'use client'

import Title from '@/components/aciksozluk/Title'

import { includesType } from '@/api'
import { useAcikSozlukAPI } from '@/lib/serverHooks'

export default function TitlePage() {
  const aciksozluk = useAcikSozlukAPI()

  const { data: entries, isLoading: isLoadingEntries } = aciksozluk.entries({
    page_size: 1,
    page: 1,
    ordering: '-created_at',
    include: 'title',
  })

  const entry = entries?.results && entries.results?.[0] && includesType(entries.results[0], 'title', 'Title')

  if (isLoadingEntries) {
    return <hr />
  }

  return entry && <Title title={entry.title} />
}
