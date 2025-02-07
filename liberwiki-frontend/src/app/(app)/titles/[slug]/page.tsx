import type { Metadata } from 'next'

import _ from 'lodash'

import NewTitle from '@/components/liberwiki/NewTitle'
import Title from '@/components/liberwiki/Title'

import { APIQuery } from '@/api'
import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { getLiberWikiMetadata } from '@/lib/metadata'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'
import '@/lib/utils'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['metadata'])
  const { data: titles } = await liberwiki.titles({ slug: params.slug, page_size: 1, page: 1 })
  const title = _.first(titles?.results)
  return await getLiberWikiMetadata({
    title: title ? title.name : decodeURI(params.slug),
    description: t('metadata:title.description', { name: config.name, title: 'title' }),
  })
}

export default async function TitlePage(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<APIQuery<'/v0/entries/'>>
}) {
  const searchParams = await props.searchParams
  const params = await props.params
  const liberwiki = sUseLiberWikiAPI()
  const { data: titles } = await liberwiki.titles({ slug: params.slug, page_size: 1, page: 1 })
  const title = _.first(titles?.results)

  return title ? <Title title={title} searchParams={searchParams} /> : <NewTitle newTitle={params.slug} />
}
