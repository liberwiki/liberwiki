import LatexBlock from '@/components/aciksozluk/Editor/TipTapLatexExtension'

import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { all, createLowlight } from 'lowlight'
import { Markdown } from 'tiptap-markdown'

export default function useAcikSozlukEditor({ content }: { content?: object }) {
  const lowlight = createLowlight(all)

  return useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'js',
      }),
      Link.configure({
        openOnClick: false,
      }),
      CharacterCount,
      Color,
      Subscript,
      Superscript,
      TaskItem.configure({
        nested: true,
      }),
      TaskList,
      TextStyle,
      Typography,
      Underline,
      Markdown,
      LatexBlock,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none',
      },
    },
    content,
  })
}
