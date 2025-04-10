'use client'

import React, { useEffect, useState } from 'react'
import { Editor } from '@tiptap/react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Code,
  Quote,
  Undo,
  Redo,
  Strikethrough,
  Trash2,
  Sparkles // Added Sparkles icon for AI assist
} from 'lucide-react'
import { CalloutType } from '../extensions/CalloutExtension'

interface ToolbarProps {
  editor: Editor | null
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  if (!editor) {
    return null
  }

  const toggleCallout = (type: CalloutType) => {
    editor.commands.toggleCallout(type)
  }
  
  const clearFormatting = () => {
    if (!editor) return;
    
    // First remove text formatting
    editor.chain().focus().unsetAllMarks().run();
    
    // Then remove block formatting if not in a paragraph
    if (!editor.isActive('paragraph')) {
      editor.chain().focus().setParagraph().run();
    }
    
    // Reset to normal paragraph if in a callout or other special block
    if (editor.isActive('callout') || 
        editor.isActive('heading') || 
        editor.isActive('bulletList') ||
        editor.isActive('orderedList') ||
        editor.isActive('blockquote') ||
        editor.isActive('codeBlock')) {
      editor.chain().focus().setParagraph().run();
    }
  }

  // Function to trigger AI assist
  const triggerAIAssist = () => {
    if (editor && editor.commands.triggerAIAssist) {
      editor.commands.triggerAIAssist()
    }
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 p-2 mb-2 rounded-md bg-white dark:bg-gray-800 shadow-sm flex flex-wrap gap-1 items-center">
      {/* History controls */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${!editor.can().undo() ? 'opacity-30' : ''}`}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={18} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${!editor.can().redo() ? 'opacity-30' : ''}`}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo size={18} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      
      {/* Text formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Bold (Ctrl+B)"
      >
        <Bold size={18} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Italic (Ctrl+I)"
      >
        <Italic size={18} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('code') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Inline Code (Ctrl+E)"
      >
        <Code size={18} />
      </button>
      
      <button
        onClick={clearFormatting}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Clear Formatting"
      >
        <Trash2 size={18} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      
      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      
      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Blockquote"
      >
        <Quote size={18} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      
      {/* Callouts */}
      <button
        onClick={() => toggleCallout('information')}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('callout', { calloutType: 'information' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title={`Information Callout (${isMac ? 'Shift+Command+I' : 'Shift+Control+I'})`}
      >
        <Info size={18} className="text-info" />
      </button>
      
      <button
        onClick={() => toggleCallout('best-practice')}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('callout', { calloutType: 'best-practice' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title={`Best Practice Callout (${isMac ? 'Shift+Command+B' : 'Shift+Control+B'})`}
      >
        <CheckCircle2 size={18} className="text-best" />
      </button>
      
      <button
        onClick={() => toggleCallout('warning')}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('callout', { calloutType: 'warning' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title={`Warning Callout (${isMac ? 'Shift+Command+U' : 'Shift+Control+U'})`}
      >
        <AlertTriangle size={18} className="text-warning" />
      </button>
      
      <button
        onClick={() => toggleCallout('error')}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('callout', { calloutType: 'error' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title={`Error Callout (${isMac ? 'Shift+Command+E' : 'Shift+Control+E'})`}
      >
        <AlertCircle size={18} className="text-error" />
      </button>
      
      {/* AI Assist Button - Added new button */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      
      <button
        onClick={triggerAIAssist}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 bg-purple-50 dark:bg-purple-900/30 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center"
        title={`AI Assist (${isMac ? 'Shift+Command+A' : 'Shift+Ctrl+A'})`}
      >
        <Sparkles size={18} className="mr-1" />
        <span className="text-sm font-medium">AI Assist</span>
      </button>
    </div>
  )
}

export default Toolbar
