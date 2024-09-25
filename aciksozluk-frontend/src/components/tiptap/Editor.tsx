'use client'

import * as Icons from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import useAcikSozlukEditor from '@/components/tiptap/aciksozlukEditor'

import EditorButton from './EditorButton'
import { EditorContent } from '@tiptap/react'

export default function Editor({ content, readonly }: { content: object; readonly: boolean }) {
  const editor = useAcikSozlukEditor({ content })
  if (!editor) {
    return null
  }
  if (readonly) {
    editor.setEditable(false)
    return <EditorContent editor={editor} />
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter the URL of the link:', previousUrl)
    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-black text-gray-100">
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2 items-center mt-6" role="toolbar" aria-label="Formatting options">
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('bold')}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              ariaLabel="Toggle bold"
              icon={Icons.Bold}
            />
            <EditorButton
              pressed={editor.isActive('italic')}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              ariaLabel="Toggle italic"
              icon={Icons.Italic}
            />
            <EditorButton
              pressed={editor.isActive('underline')}
              onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
              ariaLabel="Toggle underline"
              icon={Icons.Underline}
            />
            <EditorButton
              pressed={editor.isActive('strike')}
              onPressedChange={() => editor.chain().focus().toggleStrike().run()}
              ariaLabel="Toggle strikethrough"
              icon={Icons.Strikethrough}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton pressed={false} onPressedChange={() => {}} ariaLabel="Toggle Latex" icon={Icons.Sigma} />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('bulletList')}
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              ariaLabel="Toggle bullet list"
              icon={Icons.List}
            />
            <EditorButton
              pressed={editor.isActive('orderedList')}
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              ariaLabel="Toggle ordered list"
              icon={Icons.ListOrdered}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('link')}
              onPressedChange={setLink}
              ariaLabel="Insert link"
              icon={Icons.LinkIcon}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('code')}
              onPressedChange={() => editor.chain().focus().toggleCode().run()}
              ariaLabel="Toggle inline code"
              icon={Icons.Code}
            />
            <EditorButton
              pressed={editor.isActive('codeBlock')}
              onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
              ariaLabel="Insert code block"
              icon={Icons.Terminal}
            />
          </div>
        </div>
        <div className="border border-border rounded-md p-4 bg-background min-h-[200px]">
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
        <div className="mt-4 text-sm text-gray-400 flex items-center justify-between">
          Character count: {editor.storage.characterCount.characters()} | Word count:{' '}
          {editor.storage.characterCount.words()}
          <Button variant="outline" size="sm" aria-label="Submit">
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
