'use client'

import NewTitle from '@/components/aciksozluk/NewTitle'
import Title from '@/components/aciksozluk/Title'
import { Skeleton } from '@/components/shadcn/skeleton'

import { useAcikSozlukAPI } from '@/lib/serverHooks'

export default function TitlePage({ params }: { params: { slug: string } }) {
  const aciksozluk = useAcikSozlukAPI()
  const { data, isLoading } = aciksozluk.titles({ slug: params.slug, page_size: 1, page: 1 })
  const title = data?.results?.[0]

  return (
    <>
      {isLoading ? (
        <Skeleton className="w-full h-48" />
      ) : title ? (
        <Title title={title} />
      ) : (
        <NewTitle newTitle={params.slug} />
      )}
    </>
  )
}
