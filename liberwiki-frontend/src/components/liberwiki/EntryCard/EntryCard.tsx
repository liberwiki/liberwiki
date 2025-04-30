import Link from 'next/link'

import Entry from '@/components/liberwiki/Entry'
import { EntryEditEditor } from '@/components/liberwiki/EntryCard/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'

import { APIType, Includes } from '@/api'
import { useLiberWikiAPI as sUseLiberWikiAPI } from '@/lib/serverHooks'

export async function EntryCard({
  entry,
  editMode = false,
}: {
  entry: Includes<Includes<APIType<'Entry'>, 'author', APIType<'User'>>, 'title', APIType<'Title'>>
  editMode?: boolean
}) {
  const liberwiki = sUseLiberWikiAPI()
  const isAuthenticated = await liberwiki.isAuthenticated()
  return (
    <Card className="max-w-[calc(52rem+26px)] w-full">
      <CardHeader className="flex flex-col gap-1 border-border border-b">
        <CardTitle className="text-2xl font-bold">
          <Link href={{ pathname: `/titles/${entry.title.slug}/` }} className="hover:underline">
            {entry.title.name}
          </Link>
        </CardTitle>
      </CardHeader>
      {editMode ? (
        <EntryEditEditor entry={entry} />
      ) : (
        <CardContent>
          <Entry entry={entry} classNames={{ CardContent: 'p-0', Card: 'pt-2' }} isAuthenticated={isAuthenticated} />
        </CardContent>
      )}
    </Card>
  )
}
