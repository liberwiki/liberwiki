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
  const router = useRouter()

  const { mutateAsync: createTitle } = aciksozluk.createTitle()
  const { mutateAsync: createEntry } = aciksozluk.createEntry()

  async function handleEditorSubmit(content: object) {
    const { data: title } = await createTitle({ name: newTitle })
    await createEntry({ title: title?.id as string, content })
    toast('Your entry has been created.', {
      description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' hh:mm a"),
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    })
    router.push(`/titles/${title?.slug}`)
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
