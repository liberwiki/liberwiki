import { Metadata } from 'next'

import _ from 'lodash'

import config from '@/config'

type LiberWikiMetaData = {
  title: string
  description: string
  noIndex?: boolean
}

export async function getLiberWikiMetadata(metadata: LiberWikiMetaData): Promise<Metadata> {
  // Base metadata + og metadata for liberwiki
  const index = metadata.noIndex ? noIndex : {}
  const medaData = {
    title: metadata.title,
    description: metadata.description,
    publisher: config.name,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
      url: `https://${config.domain}`,
      siteName: config.name,
    },
  }
  return _.merge(medaData, index)
}

export const noIndex: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}
