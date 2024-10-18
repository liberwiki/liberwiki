'use client'

import _ from 'lodash'

import NewTitle from '@/components/aciksozluk/NewTitle'
import Title from '@/components/aciksozluk/Title'

import { useAcikSozlukAPI } from '@/lib/serverHooks'

export default function TitlePage({ params }: { params: { slug: string } }) {
  const aciksozluk = useAcikSozlukAPI()
  const { data: titles, isSuccess } = aciksozluk.titles({ slug: params.slug, page_size: 1, page: 1 })
  const title = _.first(titles?.results)

  return isSuccess && (title ? <Title title={title} /> : <NewTitle newTitle={params.slug} />)
}
