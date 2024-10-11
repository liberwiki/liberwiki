'use client'

import Title from '@/components/aciksozluk/Title'

import { includesType } from '@/api'
import { useAcikSozlukAPI } from '@/lib/hooks'

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 pt-6">
      <div className="w-full">{entry && <Title title={entry.title} />}</div>
    </main>
  )
}
