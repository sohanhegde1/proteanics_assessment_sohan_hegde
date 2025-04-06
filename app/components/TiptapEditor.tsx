'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useEditor, EditorContent, FloatingMenu, BubbleMenu, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
import Toolbar from './Toolbar'
import { CalloutExtension, CalloutType } from '../extensions/CalloutExtension'
import { SlashCommandsExtension } from '../extensions/SlashCommands'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2,
  Code,
  Quote
} from 'lucide-react'

const TiptapEditor = () => {
  const [showInlineBubbleMenu, setShowInlineBubbleMenu] = useState(true)
  const [showFloatingMenu, setShowFloatingMenu] = useState(true)
  const [isMac, setIsMac] = useState(false)

  // Platform detection
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  // Create direct shortcuts using Tiptap's own commands - with proper typing
  const createCallout = useCallback((editor: Editor | null, type: CalloutType) => {
    if (editor) {
      if (editor.isActive('callout')) {
        // If already in a callout, unwrap it first
        editor.chain().focus().lift('callout').run()
      }
      // Then create the new callout
      editor.chain().focus().setCallout(type).run()
      return true
    }
    return false
  }, [])

  // Handle Shift+Enter for soft breaks - with proper typing
  const handleShiftEnter = useCallback((editor: Editor | null, event: KeyboardEvent) => {
    if (editor && event.key === 'Enter' && event.shiftKey) {
      event.preventDefault()
      editor.chain().focus().insertContent('<br>').run()
      return true
    }
    return false
  }, [])

  // Initial editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      CalloutExtension,
      SlashCommandsExtension,
      BubbleMenuExtension,
      FloatingMenuExtension,
    ],
    content: `
      <h1>Tiptap Editor with Custom Callouts</h1>
      <p>This is a fully functional rich text editor with custom callout support.</p>
      <p>Here's how to use callouts:</p>
      <ul>
        <li>Click the callout icons in the toolbar</li>
        <li>Use keyboard shortcuts: Shift+Cmd+I / Shift+Ctrl+I (Information), Shift+Cmd+B / Shift+Ctrl+B (Best Practice), etc.</li>
        <li>Type / at the beginning of a line to use slash commands</li>
        <li>Click the icon in a callout to cycle through callout types</li>
      </ul>
      <p>Try creating a callout below and use formatting inside it!</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none',
      },
      handleKeyDown: (view, event) => {
        // Handle Shift+Enter for soft breaks
        if (event.key === 'Enter' && event.shiftKey) {
          handleShiftEnter(editor, event)
          return true
        }

        // Handle Shift+Cmd/Ctrl+ shortcuts for callouts
        const modKey = isMac ? event.metaKey : event.ctrlKey
        if (modKey && event.shiftKey) {
          if (event.key === 'i' || event.key === 'I') {
            event.preventDefault()
            createCallout(editor, 'information')
            return true
          }
          if (event.key === 'b' || event.key === 'B') {
            event.preventDefault()
            createCallout(editor, 'best-practice')
            return true
          }
          if (event.key === 'u' || event.key === 'U') {
            event.preventDefault()
            createCallout(editor, 'warning')
            return true
          }
          if (event.key === 'e' || event.key === 'E') {
            event.preventDefault()
            createCallout(editor, 'error')
            return true
          }
        }
        
        return false
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="tiptap-editor border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      <Toolbar editor={editor} />
      
      {/* Bubble menu for text selections */}
      {showInlineBubbleMenu && (
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }}
          shouldShow={({ editor, view, state, from, to }) => {
            // Only show for non-empty text selections
            return from !== to && !editor.isActive('callout')
          }}
        >
          <div className="flex bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('code') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              title="Code"
            >
              <Code size={16} />
            </button>
          </div>
        </BubbleMenu>
      )}
      
      {/* Floating menu for empty lines */}
      {showFloatingMenu && (
        <FloatingMenu 
          editor={editor}
          tippyOptions={{ duration: 100 }}
          shouldShow={({ state }) => {
            const { selection } = state
            const { $anchor } = selection
            
            // Show when cursor is in empty paragraph and not inside a callout
            const isEmptyTextBlock = $anchor.parent.type.name === 'paragraph' && 
                                    $anchor.parent.content.size === 0
            
            const isInsideCallout = editor.isActive('callout')
            
            return isEmptyTextBlock && !isInsideCallout
          }}
        >
          <div className="flex bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-1">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              title="Heading 1"
            >
              <Heading1 size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              title="Heading 2"
            >
              <Heading2 size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              title="Bullet List"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              title="Ordered List"
            >
              <ListOrdered size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              title="Quote"
            >
              <Quote size={16} />
            </button>
          </div>
        </FloatingMenu>
      )}
      
      <EditorContent editor={editor} className="p-4" />
      
      <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        <div className="font-medium">Editor Shortcuts:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
          <div><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">{isMac ? 'Shift+Command+I' : 'Shift+Control+I'}</kbd> Information Callout</div>
          <div><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">{isMac ? 'Shift+Command+B' : 'Shift+Control+B'}</kbd> Best Practice Callout</div>
          <div><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">{isMac ? 'Shift+Command+U' : 'Shift+Control+U'}</kbd> Warning Callout</div>
          <div><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">{isMac ? 'Shift+Command+E' : 'Shift+Control+E'}</kbd> Error Callout</div>
          <div><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">/</kbd> Type anytime to open command menu</div>
          <div><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Shift+Enter</kbd> For soft break inside callouts</div>
        </div>
      </div>
    </div>
  )
}

export default TiptapEditor