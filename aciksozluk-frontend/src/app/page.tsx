'use client'

import Entry from '@/components/aciksozluk/Entry'
import Title from '@/components/aciksozluk/Title'
import Editor from '@/components/tiptap/Editor'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 pt-6">
      <div className="w-full">
        <Title />
        <Entry id="1" />
        <Entry id="2" />
        <Entry id="3" />
        <Editor readonly={false} content={{}} />
      </div>
    </main>
  )
}
