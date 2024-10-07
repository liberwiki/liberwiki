'use client'

import _ from 'lodash'

import Title from '@/components/aciksozluk/Title'

import { useAcikSozlukAPI } from '@/lib/hooks'

export default function TitlePage() {
  const aciksozluk = useAcikSozlukAPI()

  const { data: titlesForMetaData, isLoading: isLoadingMetaData } = aciksozluk.titles({
    page_size: 1,
    page: 1,
  })

  const { data: titles, isLoading: isLoadingTitles } = aciksozluk.titles(
    {
      page_size: 1,
      page: _.random(1, titlesForMetaData?.count || 1),
    },
    { enabled: !isLoadingMetaData }
  )

  if (isLoadingMetaData || isLoadingTitles) {
    return <hr />
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 pt-6">
      <div className="w-full">{titles?.results && <Title title={titles.results[0]} />}</div>
    </main>
  )
}
