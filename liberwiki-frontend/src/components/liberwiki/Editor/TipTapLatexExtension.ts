import * as React from 'react'

import { Node, mergeAttributes, textblockTypeInputRule } from '@tiptap/core'
import { Selection } from '@tiptap/pm/state'
import katex from 'katex'

export interface LatexBlockOptions {
  katexOptions: Record<string, number | boolean | string>
  HTMLAttributes: React.HTMLAttributes<HTMLDivElement>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    latexBlock: {
      setLatexBlock: (attributes?: { language?: string }) => ReturnType
      toggleLatexBlock: (attributes?: { language?: string }) => ReturnType
    }
  }
}

export const dollarInputRegex = /^\$\$\$[\s\n]$/

const LatexBlock = Node.create<LatexBlockOptions>({
  name: 'latexBlock',
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,

  addOptions() {
    return {
      katexOptions: {
        displayMode: true,
        throwOnError: false,
      },
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="latexBlock"]', preserveWhitespace: 'full' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'latexBlock' }),
      ['pre', { class: 'latex-source' }, node.textContent],
    ]
  },

  addNodeView() {
    return ({ node, getPos: _getPos, editor }) => {
      const container = document.createElement('div')
      const textarea = document.createElement('pre')
      container.setAttribute('data-type', 'latexBlock')
      textarea.contentEditable = 'true'
      textarea.classList.add('latex-source')
      textarea.textContent = node.textContent
      container.append(textarea)

      if (!editor.isEditable) {
        katex.render(node.textContent, container, this.options.katexOptions)
        return {
          dom: container,
        }
      }

      return {
        dom: container,
        contentDOM: textarea,
      }
    }
  },

  addCommands() {
    return {
      // prettier-ignore
      toggleLatexBlock: (atts) =>({ commands }) => commands.toggleNode(this.name, 'paragraph', atts),
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-l': () => this.editor.commands.toggleLatexBlock(),
      Backspace: () => {
        const { empty, $anchor } = this.editor.state.selection
        const isAtStart = $anchor.pos === 1

        if (!empty || $anchor.parent.type.name !== this.name) {
          return false
        }

        if (isAtStart || !$anchor.parent.textContent.length) {
          return this.editor.commands.clearNodes()
        }

        return false
      },
      Enter: ({ editor }) => {
        const { state } = editor
        const { selection } = state
        const { $from, empty } = selection

        if (!empty || $from.parent.type !== this.type) {
          return false
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
        const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n')

        if (!isAtEnd || !endsWithDoubleNewline) {
          return false
        }

        // prettier-ignore
        return editor.chain().command(({ tr }) => {tr.delete($from.pos - 2, $from.pos); return true}).exitCode().run()
      },
      ArrowDown: ({ editor }) => {
        const { state } = editor
        const { selection, doc } = state
        const { $from, empty } = selection

        if (!empty || $from.parent.type !== this.type) {
          return false
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2

        if (!isAtEnd) {
          return false
        }

        const after = $from.after()

        if (after === undefined) {
          return false
        }

        const nodeAfter = doc.nodeAt(after)

        if (nodeAfter) {
          return editor.commands.command(({ tr }) => {
            tr.setSelection(Selection.near(doc.resolve(after)))
            return true
          })
        }

        return editor.commands.exitCode()
      },
    }
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: dollarInputRegex,
        type: this.type,
      }),
    ]
  },
})

export default LatexBlock
