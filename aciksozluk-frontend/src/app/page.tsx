import { Entry } from '@/components/aciksozluk/Entry'
import Editor from '@/components/tiptap/Editor'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1">
      <div className="w-full">
        <Entry />
        <Entry />
        <Entry />
        <Editor readonly={false} content={{}} />
      </div>
    </main>
  )
}
