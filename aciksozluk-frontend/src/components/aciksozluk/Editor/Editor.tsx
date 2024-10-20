import * as Icons from 'lucide-react'

import EditorButton from '@/components/aciksozluk/Editor/EditorButton'
import useAcikSozlukEditor from '@/components/aciksozluk/Editor/aciksozlukEditor'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'

import { useClientTranslation } from '@/i18n'

import { EditorContent, Editor as TipTapEditor } from '@tiptap/react'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'

export function Editor({
  content,
  readonly,
  onSubmit = () => {},
}: {
  content?: object
  readonly: boolean
  onSubmit?: (content: object) => void
}) {
  const { t } = useClientTranslation(['common', 'editor'])

  const editor = useAcikSozlukEditor({ content })
  if (!editor) {
    return null
  }
  if (readonly) {
    editor.setEditable(false)
    return <EditorContent editor={editor} />
  }

  function setLink(editor: TipTapEditor) {
    return function () {
      const previousUrl = editor.getAttributes('link').href
      const url = window.prompt(t('editor:setLink'), previousUrl)
      if (url === null) {
        return
      }
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  async function handleSubmit() {
    if (editor) {
      onSubmit(editor.getJSON())
      editor.commands.clearContent(true)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-black text-gray-100">
      <CardContent>
        <div
          className="flex flex-wrap gap-2 mb-2 items-center mt-6"
          role="toolbar"
          aria-label={t('editor:formattingOptions')}
        >
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('bold')}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              ariaLabel={t('editor:toggleBold')}
              icon={Icons.Bold}
            />
            <EditorButton
              pressed={editor.isActive('italic')}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              ariaLabel={t('editor:toggleItalic')}
              icon={Icons.Italic}
            />
            <EditorButton
              pressed={editor.isActive('underline')}
              onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
              ariaLabel={t('editor:toggleUnderline')}
              icon={Icons.Underline}
            />
            <EditorButton
              pressed={editor.isActive('strike')}
              onPressedChange={() => editor.chain().focus().toggleStrike().run()}
              ariaLabel={t('editor:toggleStrikeThrough')}
              icon={Icons.Strikethrough}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('latexBlock')}
              onPressedChange={() => editor.chain().focus().toggleLatexBlock().run()}
              ariaLabel={t('editor:toggleLatex')}
              icon={Icons.Sigma}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('bulletList')}
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              ariaLabel={t('editor:toggleBulletList')}
              icon={Icons.List}
            />
            <EditorButton
              pressed={editor.isActive('orderedList')}
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              ariaLabel={t('editor:toggleOrderedList')}
              icon={Icons.ListOrdered}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('link')}
              onPressedChange={setLink(editor)}
              ariaLabel="Insert link"
              icon={Icons.LinkIcon}
            />
          </div>
          <div className="w-px h-6 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('code')}
              onPressedChange={() => editor.chain().focus().toggleCode().run()}
              ariaLabel={t('editor:toggleInlineCode')}
              icon={Icons.Code}
            />
            <EditorButton
              pressed={editor.isActive('codeBlock')}
              onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
              ariaLabel={t('editor:toggleCodeBlock')}
              icon={Icons.Terminal}
            />
          </div>
        </div>
        <div className="border border-border rounded-md p-4 bg-background min-h-[200px]">
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
        <div className="mt-4 text-sm text-gray-400 flex items-center justify-between">
          <div className="flex gap-2">
            <span>{t('editor:characterCount', { count: editor.storage.characterCount.characters() })}</span>
            <span>|</span>
            <span>{t('editor:wordCount', { count: editor.storage.characterCount.words() })}</span>
          </div>
          <Button variant="outline" size="sm" aria-label={t('common:submit')} onClick={handleSubmit}>
            {t('common:submit')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
