// app/components/AIAssistManager.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'
import AIAssistPopup from './AIAssistPopup'

interface AIAssistManagerProps {
  editor: Editor;
}

interface AIAssistState {
  isActive: boolean;
  from: number;
  to: number;
  selectedText: string;
  position: { top: number; left: number } | null;
}

const AIAssistManager: React.FC<AIAssistManagerProps> = ({ editor }) => {
  const [aiAssistState, setAIAssistState] = useState<AIAssistState>({
    isActive: false,
    from: 0,
    to: 0,
    selectedText: '',
    position: null,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const eventTriggeredRef = useRef(false)

  useEffect(() => {
    // Listen for the custom event from the AIAssistExtension
    const handleAIAssistTrigger = (event: CustomEvent) => {
      const { from, to, selectedText } = event.detail
      
      // Set the flag that this was explicitly triggered
      eventTriggeredRef.current = true
      
      // Don't trigger unless there's actual text selected
      if (!selectedText || selectedText.trim() === '') {
        console.log('No text selected, not showing AI popup');
        return;
      }
      
      // Position the popup on the right side of the screen
      // with margin to ensure it stays completely within the viewport
      const position = {
        top: 120, // Fixed position from the top
        left: Math.max(20, window.innerWidth - 404), // 384px width + 20px margin
      }
      
      // Clear any existing timeouts to prevent multiple popups
      setAIAssistState({
        isActive: true,
        from,
        to,
        selectedText,
        position,
      })
      
      // Reset the flag after a short delay
      setTimeout(() => {
        eventTriggeredRef.current = false;
      }, 500);
    }
    
    // Add event listener to handle AI assist trigger
    const editorElement = editor.view.dom
    editorElement.addEventListener('tiptap:ai-assist-trigger', handleAIAssistTrigger as EventListener)
    
    // Cleanup event listener
    return () => {
      editorElement.removeEventListener('tiptap:ai-assist-trigger', handleAIAssistTrigger as EventListener)
    }
  }, [editor])

  // Prevent accidental state activations
  useEffect(() => {
    // On mount, ensure it starts inactive
    if (!eventTriggeredRef.current) {
      setAIAssistState(prev => ({
        ...prev,
        isActive: false
      }));
    }
  }, []);

  // Handle clicks outside the popup to close it
  useEffect(() => {
    if (!aiAssistState.isActive) return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        !editor.view.dom.contains(event.target as Node)
      ) {
        closeAIAssist()
      }
    }
    
    // Add escape key press handler
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAIAssist()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [aiAssistState.isActive, editor])

  const closeAIAssist = () => {
    eventTriggeredRef.current = false;
    setAIAssistState(prev => ({ ...prev, isActive: false }))
  }

  // Only render the popup when active, event was triggered, and we have a position
  if (!aiAssistState.isActive || !aiAssistState.position) {
    return null
  }

  return createPortal(
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: `${aiAssistState.position.top}px`,
        left: `${aiAssistState.position.left}px`,
        zIndex: 50,
        maxWidth: 'calc(100vw - 40px)' // Ensure it doesn't overflow horizontally
      }}
      className="ai-assist-container"
    >
      <div className="ai-assist-wrapper">
        <AIAssistPopup 
          editor={editor}
          from={aiAssistState.from}
          to={aiAssistState.to}
          selectedText={aiAssistState.selectedText}
          onClose={closeAIAssist}
        />
      </div>
    </div>,
    document.body
  )
}

export default AIAssistManager