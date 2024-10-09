'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Editor from '@/components/aciksozluk/Editor'
import { Separator } from '@/components/shadcn/separator'

import { useAcikSozlukAPI } from '@/lib/hooks'

import { format } from 'date-fns'
import { toast } from 'sonner'

export function NewTitle({ newTitle }: { newTitle: string }) {
  newTitle = decodeURI(newTitle)
  const aciksozluk = useAcikSozlukAPI()
  const queryClient = aciksozluk.useQueryClient()
  const router = useRouter()

  const { mutateAsync: createTitle } = aciksozluk.createTitle()
  const { mutateAsync: createEntry } = aciksozluk.createEntry()

  async function handleEditorSubmit(content: object) {
    const { data: title, response: createTitleResponse } = await createTitle({ name: newTitle })
    const { response: createEntryResponse } = await createEntry({ title: title?.id as string, content })
    if (createTitleResponse.ok && createEntryResponse.ok) {
      toast('Your entry has been created.', { description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' hh:mm a") })
    } else {
      toast('An error occurred while creating your entry. Please try again later.', {
        description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' hh:mm a"),
      })
    }
    router.push(`/titles/${title?.slug}`)
    await queryClient.invalidateQueries()
  }

  return (
    <>
      <div>
        <Link className="h-1 p-6 text-xl font-bold" href="/">
          {newTitle}
        </Link>
        <div className="mt-2 px-4">
          <Separator />
        </div>
      </div>
      <div className="text-center text-gray-500 p-10">
        No entries found. Be the first one to share your information.
      </div>
      <Editor readonly={false} onSubmit={handleEditorSubmit} />
    </>
  )
}
