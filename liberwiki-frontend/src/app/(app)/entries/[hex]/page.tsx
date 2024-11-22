import type { Metadata } from 'next'

import EntryCard from '@/components/liberwiki/EntryCard'

import { APIType, includesType } from '@/api'
import config from '@/config'
import { sUseTranslation } from '@/i18n'
import { getLiberWikiMetadata } from '@/lib/metadata'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'
import { hexToUUIDv4 } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { hex: string } }): Promise<Metadata> {
  const liberwiki = sUseLiberWikiAPI()
  const { t } = await sUseTranslation(['metadata'])
  const { data: entryData } = await liberwiki.entry(hexToUUIDv4(params.hex), { include: 'author,title' })
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

export default async function EntryPage({ params }: { params: { hex: string } }) {
  const liberwiki = sUseLiberWikiAPI()
  const { data: entry } = await liberwiki.entry(hexToUUIDv4(params.hex), { include: 'author,title' })
  return <EntryCard entry={includesType(includesType(entry as APIType<'Entry'>, 'author', 'User'), 'title', 'Title')} />
}
