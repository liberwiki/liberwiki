'use client'

import _ from 'lodash'

import NewTitle from '@/components/liberwiki/NewTitle'
import Title from '@/components/liberwiki/Title'

import { useLiberWikiAPI } from '@/lib/serverHooks'

export default function TitlePage({ params }: { params: { slug: string } }) {
  const liberwiki = useLiberWikiAPI()
  const { data: titles, isSuccess } = liberwiki.titles({ slug: params.slug, page_size: 1, page: 1 })
  const title = _.first(titles?.results)

  return isSuccess && (title ? <Title title={title} /> : <NewTitle newTitle={params.slug} />)
}
