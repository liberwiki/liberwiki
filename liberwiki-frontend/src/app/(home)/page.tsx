import _ from 'lodash'

import Title from '@/components/liberwiki/Title'

import { APIQuery, includesType } from '@/api'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

export default async function Home(props: { searchParams: Promise<APIQuery<'/v0/entries/'>> }) {
  const searchParams = await props.searchParams
  const liberwiki = sUseLiberWikiAPI()

  const { data: entries } = await liberwiki.entries({
    page_size: 1,
    page: 1,
    ordering: '-created_at',
    include: 'title',
  })

  const firstEntry = _.first(entries?.results)
  const entry = firstEntry && includesType(firstEntry, 'title', 'Title')

  return entry && <Title title={entry.title} searchParams={searchParams} />
}
