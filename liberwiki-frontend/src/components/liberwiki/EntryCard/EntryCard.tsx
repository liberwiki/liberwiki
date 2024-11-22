import Entry from '@/components/liberwiki/Entry'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'

import { APIType, Includes } from '@/api'

export async function EntryCard({
  entry,
}: {
  entry: Includes<Includes<APIType<'Entry'>, 'author', APIType<'User'>>, 'title', APIType<'Title'>>
}) {
  return (
    <Card className="max-w-[48rem] w-full">
      <CardHeader className="flex flex-col gap-1 border-border border-b">
        <CardTitle className="text-2xl font-bold">{entry.title.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Entry entry={entry} classNames={{ CardContent: 'p-0', Card: 'pt-2' }} />
      </CardContent>
    </Card>
  )
}
