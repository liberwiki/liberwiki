'use client'

import { Card, CardContent } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import useAcikSozlukEditor from '@/components/tiptap/aciksozlukEditor'

import EditorButton from './EditorButton'
import { EditorContent } from '@tiptap/react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Palette,
  Sigma,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Terminal,
  Underline as UnderlineIcon,
} from 'lucide-react'

const Editor = ({ content, readonly }: { content: object; readonly: boolean }) => {
  const editor = useAcikSozlukEditor({ content })
  if (!editor) {
    return null
  }
  if (readonly) {
    editor.setEditable(false)
    return <EditorContent editor={editor} />
  }

  console.log(editor.getJSON())

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

  const currentColor = editor.getAttributes('textStyle').color || '#ffffff'

  return (
    <Card className="w-full max-w-4xl mx-auto bg-black text-gray-100">
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4 items-center mt-8" role="toolbar" aria-label="Formatting options">
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('bold')}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              ariaLabel="Toggle bold"
              icon={Bold}
            />
            <EditorButton
              pressed={editor.isActive('italic')}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              ariaLabel="Toggle italic"
              icon={Italic}
            />
            <EditorButton
              pressed={editor.isActive('underline')}
              onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
              ariaLabel="Toggle underline"
              icon={UnderlineIcon}
            />
            <EditorButton
              pressed={editor.isActive('strike')}
              onPressedChange={() => editor.chain().focus().toggleStrike().run()}
              ariaLabel="Toggle strikethrough"
              icon={Strikethrough}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('subscript')}
              onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
              ariaLabel="Toggle subscript"
              icon={SubscriptIcon}
            />
            <EditorButton
              pressed={editor.isActive('superscript')}
              onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
              ariaLabel="Toggle superscript"
              icon={SuperscriptIcon}
            />
            <EditorButton pressed={false} onPressedChange={() => {}} ariaLabel="Toggle superscript" icon={Sigma} />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('bulletList')}
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              ariaLabel="Toggle bullet list"
              icon={List}
            />
            <EditorButton
              pressed={editor.isActive('orderedList')}
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              ariaLabel="Toggle ordered list"
              icon={ListOrdered}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive({ textAlign: 'left' })}
              onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
              ariaLabel="Align left"
              icon={AlignLeft}
            />
            <EditorButton
              pressed={editor.isActive({ textAlign: 'center' })}
              onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
              ariaLabel="Align center"
              icon={AlignCenter}
            />
            <EditorButton
              pressed={editor.isActive({ textAlign: 'right' })}
              onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
              ariaLabel="Align right"
              icon={AlignRight}
            />
            <EditorButton
              pressed={editor.isActive({ textAlign: 'justify' })}
              onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
              ariaLabel="Justify"
              icon={AlignJustify}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('link')}
              onPressedChange={setLink}
              ariaLabel="Insert link"
              icon={LinkIcon}
            />
            <EditorButton
              pressed={editor.isActive('code')}
              onPressedChange={() => editor.chain().focus().toggleCode().run()}
              ariaLabel="Toggle inline code"
              icon={Code}
            />
            <EditorButton
              pressed={editor.isActive('codeBlock')}
              onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
              ariaLabel="Insert code block"
              icon={Terminal}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="relative">
            <EditorButton ariaLabel="Toggle text color" icon={Palette} style={{ color: currentColor }} />
            <Input
              type="color"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              value={currentColor}
              onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
            />
          </div>
        </div>
        <div className="border border-border rounded-md p-4 bg-background min-h-[200px]">
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
        <div className="mt-4 text-sm text-gray-400">
          Character count: {editor.storage.characterCount.characters()} | Word count:{' '}
          {editor.storage.characterCount.words()}
        </div>
      </CardContent>
    </Card>
  )
}

export default Editor
