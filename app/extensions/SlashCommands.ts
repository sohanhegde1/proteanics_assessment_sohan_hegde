import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import CommandList from '../components/CommandList'
import { PluginKey } from 'prosemirror-state'

// Create a plugin key outside the extension
const slashCommandsPluginKey = new PluginKey('slashCommands')

// Define command item type for better TypeScript support
export interface CommandItem {
  title: string
  description: string
  category: string
  icon?: string
  shortcut?: string
  command: ({ editor, range }: { editor: any; range: any }) => void
}

export const SlashCommandsExtension = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        },
        startOfLine: false, // Allow slash commands anywhere, not just at start of line
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        // Pass the plugin key as a reference, not a new instance
        pluginKey: slashCommandsPluginKey,
        char: this.options.suggestion.char,
        startOfLine: this.options.suggestion.startOfLine,
        items: ({ query }: { query: string }) => {
          const items: CommandItem[] = [
            // Callouts
            {
              title: 'Information Callout',
              description: 'Add an information callout box',
              category: 'Callouts',
              icon: 'info',
              shortcut: 'Shift+Command+I',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setCallout('information')
                  .run()
              },
            },
            {
              title: 'Best Practice Callout',
              description: 'Add a best practice callout box',
              category: 'Callouts',
              icon: 'check-circle',
              shortcut: 'Shift+Command+B',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setCallout('best-practice')
                  .run()
              },
            },
            {
              title: 'Warning Callout',
              description: 'Add a warning callout box',
              category: 'Callouts',
              icon: 'alert-triangle',
              shortcut: 'Shift+Command+U',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setCallout('warning')
                  .run()
              },
            },
            {
              title: 'Error Callout',
              description: 'Add an error callout box',
              category: 'Callouts',
              icon: 'alert-circle',
              shortcut: 'Shift+Command+E',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setCallout('error')
                  .run()
              },
            },
            
            // Headings
            {
              title: 'Heading 1',
              description: 'Large section heading',
              category: 'Basic blocks',
              icon: 'heading-1',
              shortcut: '# + space',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHeading({ level: 1 })
                  .run()
              },
            },
            {
              title: 'Heading 2',
              description: 'Medium section heading',
              category: 'Basic blocks',
              icon: 'heading-2',
              shortcut: '## + space',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHeading({ level: 2 })
                  .run()
              },
            },
            {
              title: 'Heading 3',
              description: 'Small section heading',
              category: 'Basic blocks',
              icon: 'heading-3',
              shortcut: '### + space',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHeading({ level: 3 })
                  .run()
              },
            },
            
            // Lists
            {
              title: 'Bullet List',
              description: 'Create a bulleted list',
              category: 'Lists',
              icon: 'list',
              shortcut: '- + space',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBulletList()
                  .run()
              },
            },
            {
              title: 'Numbered List',
              description: 'Create a numbered list',
              category: 'Lists',
              icon: 'list-ordered',
              shortcut: '1. + space',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleOrderedList()
                  .run()
              },
            },
            {
              title: 'Task List',
              description: 'Create a task checklist',
              category: 'Lists',
              icon: 'check-square',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleTaskList()
                  .run()
              },
            },
            
            // Other blocks
            {
              title: 'Blockquote',
              description: 'Create a quote block',
              category: 'Basic blocks',
              icon: 'quote',
              shortcut: '> + space',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBlockquote()
                  .run()
              },
            },
            {
              title: 'Code Block',
              description: 'Add a code block',
              category: 'Basic blocks',
              icon: 'code',
              shortcut: '``` + enter',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleCodeBlock()
                  .run()
              },
            },
            {
              title: 'Horizontal Rule',
              description: 'Add a horizontal divider line',
              category: 'Basic blocks',
              icon: 'minus',
              shortcut: '--- + enter',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHorizontalRule()
                  .run()
              },
            },
          ]

          // Filter items based on query
          const normalizedQuery = query.toLowerCase().trim()
          
          if (!normalizedQuery) return items
          
          return items.filter(item => 
            item.title.toLowerCase().includes(normalizedQuery) ||
            item.description.toLowerCase().includes(normalizedQuery) ||
            item.category.toLowerCase().includes(normalizedQuery)
          )
        },
        render: () => {
          // @ts-ignore - Using any types to overcome strict type checking
          let reactRenderer: any
          // @ts-ignore
          let popup: any = null

          return {
            onStart: props => {
              // @ts-ignore - Bypass all type checking
              reactRenderer = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
              })

              // @ts-ignore - Bypass all type checking for tippy
              popup = tippy(document.body, {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: reactRenderer.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                theme: 'light-border',
                arrow: true,
                maxWidth: 'none',
              })[0]
            },
            onUpdate(props) {
              // @ts-ignore
              reactRenderer.updateProps(props)

              if (popup) {
                // @ts-ignore
                popup.setProps({
                  // @ts-ignore
                  getReferenceClientRect: props.clientRect,
                })
              }
            },
            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                if (popup) {
                  // @ts-ignore
                  popup.hide()
                }
                return true
              }

              // @ts-ignore
              return reactRenderer.ref?.onKeyDown(props)
            },
            onExit() {
              if (popup) {
                // @ts-ignore
                popup.destroy()
              }
              // @ts-ignore
              reactRenderer.destroy()
            },
          }
        },
      }),
    ]
  },
})

export default SlashCommandsExtension
