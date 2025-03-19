'use client'

import '@/components/liberwiki/Editor/editor.css'

import { useRouter } from 'next/navigation'

import * as Icons from 'lucide-react'

import _ from 'lodash'

import EditorButton from '@/components/liberwiki/Editor/EditorButton'
import useLiberWikiEditor from '@/components/liberwiki/Editor/liberwikiEditor'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'

import { useClientTranslation } from '@/i18n'

import { EditorContent, Editor as TipTapEditor } from '@tiptap/react'

export function Editor({
  content,
  readonly,
  onSubmit,
  onDismiss,
  draftable = false,
}: {
  content?: object
  readonly: boolean
  onSubmit?: (content: object, draft?: boolean) => void
  onDismiss?: () => void
  draftable?: boolean
}) {
  const { t } = useClientTranslation(['common', 'editor'])
  const editor = useLiberWikiEditor({ content })
  const router = useRouter()

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
      onSubmit?.(editor.getJSON())
      editor.commands.clearContent(true)
    }
  }

  async function handleDraftSubmit() {
    if (editor) {
      onSubmit?.(editor.getJSON(), true)
      router.refresh()
    }
  }

  async function handleDeleteDraft() {
    if (editor) {
      onDismiss?.()
      editor.commands.clearContent(true)
    }
  }

  return (
    <Card className="w-full text-gray-100">
      <CardContent className="p-6 pt-6 max-sm:p-4 max-sm:pt-4">
        <div
          className="flex flex-wrap gap-2 max-sm:gap-0 items-center"
          role="toolbar"
          aria-label={t('editor:formattingOptions')}
        >
          <div className="flex gap-2 max-sm:gap-0 items-center">
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
          <div className="w-px h-6 max-sm:h-4 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 max-sm:gap-0 items-center">
            <EditorButton
              pressed={editor.isActive('latexBlock')}
              onPressedChange={() => editor.chain().focus().toggleLatexBlock().run()}
              ariaLabel={t('editor:toggleLatex')}
              icon={Icons.Sigma}
            />
          </div>
          <div className="w-px h-6 max-sm:h-4 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 max-sm:gap-0 items-center">
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
          <div className="w-px h-6 max-sm:h-4 max-sm:gap-0 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 items-center">
            <EditorButton
              pressed={editor.isActive('link')}
              onPressedChange={setLink(editor)}
              ariaLabel="Insert link"
              icon={Icons.LinkIcon}
            />
          </div>
          <div className="w-px h-6 max-sm:h-4 bg-gray-700" aria-hidden="true" />
          <div className="flex gap-2 max-sm:gap-0 items-center">
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
        <EditorContent editor={editor} className="tiptap-editor" />
        <div className="text-sm text-gray-400 flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2">
            <span>{t('editor:characterCount', { count: editor.storage.characterCount.characters() })}</span>
            <span>|</span>
            <span>{t('editor:wordCount', { count: editor.storage.characterCount.words() })}</span>
          </div>
          <div className="flex gap-2 justify-end max-sm:w-full">
            {draftable && !_.isEmpty(content) && !readonly && (
              <Button variant="destructive" size="sm" aria-label={t('common:submitDraft')} onClick={handleDeleteDraft}>
                {t('common:deleteDraft')}
              </Button>
            )}
            {draftable && (
              <Button variant="outline" size="sm" aria-label={t('common:submitDraft')} onClick={handleDraftSubmit}>
                {t('common:submitDraft')}
              </Button>
            )}
            <Button variant="outline" size="sm" aria-label={t('common:submit')} onClick={handleSubmit}>
              {t('common:submit')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
