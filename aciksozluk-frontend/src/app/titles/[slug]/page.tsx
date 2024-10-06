'use client'

import NewTitle from '@/components/aciksozluk/NewTitle'
import Title from '@/components/aciksozluk/Title'

import { useAcikSozlukAPI } from '@/lib/hooks'

export default function TitlePage({ params }: { params: { slug: string } }) {
  const aciksozluk = useAcikSozlukAPI()
  const { data, isLoading } = aciksozluk.titles({ slug: params.slug, page_size: 1, page: 1 })
  const title = data?.results?.[0]

  if (isLoading) {
    return <hr />
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 pt-6">
      <div className="w-full">{title ? <Title title={title} /> : <NewTitle newTitle={params.slug} />}</div>
    </main>
  )
}
