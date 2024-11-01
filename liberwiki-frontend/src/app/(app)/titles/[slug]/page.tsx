import _ from 'lodash'

import NewTitle from '@/components/liberwiki/NewTitle'
import Title from '@/components/liberwiki/Title'

import { APIQuery } from '@/api'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

export default async function TitlePage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: APIQuery<'/v0/entries/'>
}) {
  const liberwiki = sUseLiberWikiAPI()
  const { data: titles } = await liberwiki.titles({ slug: params.slug, page_size: 1, page: 1 })
  const title = _.first(titles?.results)

  return title ? <Title title={title} searchParams={searchParams} /> : <NewTitle newTitle={params.slug} />
}
