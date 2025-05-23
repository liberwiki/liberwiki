import BlockQuote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import CharacterCount from '@tiptap/extension-character-count'
import Code from '@tiptap/extension-code'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import History from '@tiptap/extension-history'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { generateHTML } from '@tiptap/html'
import { JSONContent, useEditor } from '@tiptap/react'
import { common, createLowlight } from 'lowlight'

function getLiberWikiEditorExtensions({ forHTMLGeneration = false }: { forHTMLGeneration?: boolean } = {}) {
  const lowlight = createLowlight(common)

  const markExtensions = [
    Subscript,
    Superscript,
    Underline,
    Typography,
    TextStyle,
    Strike,
    Italic,
    Bold,
    Link.configure({
      openOnClick: false,
    }),
  ]

  const nodeExtensions = [
    Document,
    Text,
    Paragraph,
    BulletList,
    OrderedList,
    ListItem,
    HorizontalRule,
    HardBreak,
    BlockQuote,
  ]

  const codeBlockExtensions = [
    Code.configure({
      HTMLAttributes: {
        class: 'font-code',
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class: 'font-code',
      },
    }),
  ]

  const otherExtensions = forHTMLGeneration ? [] : [CharacterCount, History]

  return [...markExtensions, ...nodeExtensions, ...codeBlockExtensions, ...otherExtensions]
}

export default function useLiberWikiEditor({ content }: { content?: object }) {
  return useEditor(
    {
      immediatelyRender: false,
      extensions: getLiberWikiEditorExtensions(),
      editorProps: {
        attributes: {
          class: 'prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none',
        },
      },
      content,
    },
    [content]
  )
}

export function getLiberWikiEditorContentHTML(content: JSONContent) {
  return generateHTML(content, getLiberWikiEditorExtensions({ forHTMLGeneration: true }))
}
