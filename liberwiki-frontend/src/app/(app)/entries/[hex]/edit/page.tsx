import type { Metadata } from 'next'
import { forbidden, notFound } from 'next/navigation'

import _ from 'lodash'

import EntryCard from '@/components/liberwiki/EntryCard'

import { APIType, includesType } from '@/api'
import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { getLiberWikiMetadata } from '@/lib/metadata'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'
import { InvalidHEXError, hexToUUIDv4, suppress } from '@/lib/utils'

export async function generateMetadata(props: { params: Promise<{ hex: string }> }): Promise<Metadata | undefined> {
  const params = await props.params
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['metadata'])
  const entryId = suppress<string, undefined>([InvalidHEXError], () => hexToUUIDv4(params.hex))
  if (!_.isUndefined(entryId)) {
    const { data: entryData } = await liberwiki.entry(entryId, { include: 'author,title' })
    if (!_.isUndefined(entryData)) {
      const entry = includesType(includesType(entryData as APIType<'Entry'>, 'author', 'User'), 'title', 'Title')
      return await getLiberWikiMetadata({
        title: entry.title.name,
        description: t('metadata:entry.description', {
          name: config.name,
          title: entry.title.name,
          author: entry.author.username,
        }),
      })
    }
  }
  return notFound()
}

export default async function EntryEditPage(props: { params: Promise<{ hex: string }> }) {
  const params = await props.params
  const liberwiki = sUseLiberWikiAPI()
  const entryId = suppress<string, undefined>([InvalidHEXError], () => hexToUUIDv4(params.hex))

  if (!_.isUndefined(entryId)) {
    const { data: entry } = await liberwiki.entry(entryId, { include: 'author,title' })
    if (!_.isUndefined(entry)) {
      const entry_ = includesType(includesType(entry as APIType<'Entry'>, 'author', 'User'), 'title', 'Title')
      const { data: me } = await liberwiki.me()
      if (entry_.author.id !== me?.id) {
        return forbidden()
      }
      return <EntryCard entry={entry_} editMode />
    }
  }
  return notFound()
}
