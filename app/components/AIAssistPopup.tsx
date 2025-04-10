// app/components/AIAssistPopup.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { Sparkles, Check, X, ChevronRight, Wand2, RotateCcw, ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react'

interface AIAssistPopupProps {
  editor: Editor;
  from: number;
  to: number;
  selectedText: string;
  onClose: () => void;
}

type AIState = 'idle' | 'loading' | 'diff' | 'error' | 'feedback';

interface DiffResult {
  originalText: string;
  modifiedText: string;
  diff: Array<{
    added?: boolean;
    removed?: boolean;
    value: string;
  }>;
}

const AIAssistPopup: React.FC<AIAssistPopupProps> = ({
  editor,
  from,
  to,
  selectedText,
  onClose,
}) => {
  const [prompt, setPrompt] = useState('')
  const [aiState, setAIState] = useState<AIState>('idle')
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null)
  const [error, setError] = useState<string>('')
  const [promptHistory, setPromptHistory] = useState<string[]>([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // Common prompt suggestions
  const commonPrompts = [
    "Make it more concise",
    "Make it more formal",
    "Fix grammar and spelling",
    "Simplify the language"
  ];

  useEffect(() => {
    // Focus the input when the popup appears
    inputRef.current?.focus()
    
    // Add animation class after mounting
    setTimeout(() => {
      if (popupRef.current) {
        popupRef.current.classList.add('ai-popup-active');
      }
    }, 10);
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    // Add to history
    setPromptHistory(prev => [prompt, ...prev.slice(0, 9)]) // Keep last 10 prompts
    setCurrentHistoryIndex(-1)
    
    setAIState('loading')

    try {
      // Call the API with selected text and prompt
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: selectedText,
          prompt: prompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      
      // Process the diff between original and modified text
      const diffResult: DiffResult = {
        originalText: selectedText,
        modifiedText: data.modifiedText,
        diff: generateDiff(selectedText, data.modifiedText)
      }
      
      setDiffResult(diffResult)
      setAIState('diff')
    } catch (err) {
      console.error('AI assist error:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setAIState('error')
    }
  }

  const applyChanges = () => {
    if (!diffResult) return
    
    // Apply changes to the editor
    editor.chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(diffResult.modifiedText)
      .run()
    
    // Show feedback state
    setAIState('feedback')
    
    // Auto close after feedback or timeout
    setTimeout(() => {
      onClose()
    }, 3000) // Close after 3 seconds
  }

  const navigateHistory = (direction: 'up' | 'down') => {
    if (promptHistory.length === 0) return;
    
    let newIndex = currentHistoryIndex;
    
    if (direction === 'up') {
      newIndex = newIndex < promptHistory.length - 1 ? newIndex + 1 : newIndex;
    } else {
      newIndex = newIndex > -1 ? newIndex - 1 : -1;
    }
    
    setCurrentHistoryIndex(newIndex);
    
    if (newIndex >= 0 && newIndex < promptHistory.length) {
      setPrompt(promptHistory[newIndex]);
    } else if (newIndex === -1) {
      setPrompt('');
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Navigate history with up/down arrows
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    }
  }

  const generateDiff = (original: string, modified: string): Array<{added?: boolean; removed?: boolean; value: string}> => {
    // This is a simple diff algorithm for demonstration
    // In a production app, you might want to use a more robust diff library like 'diff'
    
    // For this demo, we'll use a naive character-by-character comparison
    const diff: Array<{added?: boolean; removed?: boolean; value: string}> = []
    
    let i = 0, j = 0
    
    while (i < original.length || j < modified.length) {
      if (i < original.length && j < modified.length && original[i] === modified[j]) {
        // Characters match, add as unchanged
        let value = original[i]
        i++
        j++
        
        // Group consecutive unchanged characters
        while (i < original.length && j < modified.length && original[i] === modified[j]) {
          value += original[i]
          i++
          j++
        }
        
        diff.push({ value })
      } else {
        // Handle removed characters from original
        if (i < original.length) {
          let value = original[i]
          i++
          
          // Group consecutive removed characters
          while (i < original.length && (j >= modified.length || original[i] !== modified[j])) {
            value += original[i]
            i++
          }
          
          diff.push({ removed: true, value })
        }
        
        // Handle added characters from modified
        if (j < modified.length) {
          let value = modified[j]
          j++
          
          // Group consecutive added characters
          while (j < modified.length && (i >= original.length || original[i] !== modified[j])) {
            value += modified[j]
            j++
          }
          
          diff.push({ added: true, value })
        }
      }
    }
    
    return diff
  }

  const selectPrompt = (suggestion: string) => {
    setPrompt(suggestion);
    // Auto-submit after a short delay
    setTimeout(() => {
      handleSubmit(new Event('submit') as any);
    }, 100);
  };

  const resetToIdle = () => {
    setAIState('idle');
    setPrompt('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const provideFeedback = (isPositive: boolean) => {
    // In a real app, you would send feedback to your API
    console.log(`User provided ${isPositive ? 'positive' : 'negative'} feedback`);
    onClose();
  };

  return (
    <div ref={popupRef} className="ai-popup fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-96 overflow-hidden ai-popup-enter">
      
      {/* Header - present in all states */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800 p-3 flex items-center">
        <div className="flex items-center">
          <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center mr-2">
            <Wand2 size={16} className="text-white" />
          </div>
          <span className="font-medium text-white">AI Assist</span>
        </div>
        <button 
          type="button" 
          onClick={onClose}
          className="ml-auto text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Idle state - input prompt */}
      {aiState === 'idle' && (
        <div className="flex flex-col">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="relative">
              <div className="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition duration-200">
                <input
                  ref={inputRef}
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="How should I modify this text?"
                  className="w-full bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button 
                  type="submit" 
                  className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                  disabled={!prompt.trim()}
                  aria-label="Submit"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                <span>Suggestions:</span>
                {promptHistory.length > 0 && (
                  <button 
                    onClick={() => navigateHistory('up')}
                    className="ml-auto text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center"
                  >
                    <RotateCcw size={12} className="mr-1" /> History
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {commonPrompts.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectPrompt(suggestion)}
                    className="text-xs px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800/50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Loading state */}
      {aiState === 'loading' && (
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="ai-loading-ring"></div>
            <Sparkles size={20} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-500" />
          </div>
          <p className="text-base text-center text-gray-700 dark:text-gray-300 font-medium">
            Generating suggestions<span className="ai-loading-dots"></span>
          </p>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 max-w-[250px]">
            AI is analyzing your text to create the best possible modifications
          </p>
        </div>
      )}

      {/* Diff view - show changes */}
      {aiState === 'diff' && diffResult && (
        <div className="flex flex-col">
          <div className="p-4">
            {/* Title */}
            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <button 
                onClick={resetToIdle}
                className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Back to prompt"
              >
                <ArrowLeft size={16} />
              </button>
              <span>Suggested Changes</span>
              <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                {prompt}
              </span>
            </div>
            
            {/* Diff view */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                Diff View
              </div>
              <div className="max-h-60 overflow-y-auto px-3 py-2 bg-white dark:bg-gray-800">
                <div className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
                  {diffResult.diff.map((part, i) => (
                    <span 
                      key={i} 
                      className={
                        part.added 
                          ? 'ai-diff-added' 
                          : part.removed 
                          ? 'ai-diff-removed' 
                          : ''
                      }
                    >
                      {part.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-between mt-4">
              <button 
                type="button" 
                onClick={resetToIdle}
                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Try Another Prompt
              </button>
              <button 
                type="button" 
                onClick={applyChanges}
                className="px-3 py-1.5 text-sm rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm flex items-center transition-all transform hover:scale-105"
              >
                <Check size={14} className="mr-1" /> Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback state */}
      {aiState === 'feedback' && (
        <div className="p-6 flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
            <Check size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="text-base text-center text-gray-700 dark:text-gray-300 font-medium mb-2">
            Changes Applied!
          </p>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
            Was this suggestion helpful?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => provideFeedback(true)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              title="Thumbs Up"
            >
              <ThumbsUp size={18} />
            </button>
            <button
              onClick={() => provideFeedback(false)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Thumbs Down"
            >
              <ThumbsDown size={18} />
            </button>
          </div>
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
            Closing automatically in a few seconds...
          </p>
        </div>
      )}

      {/* Error state */}
      {aiState === 'error' && (
        <div className="p-4">
          <div className="flex flex-col items-center p-4">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
              <X size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <p className="text-base text-center text-gray-700 dark:text-gray-300 font-medium mb-2">
              Something went wrong
            </p>
            <p className="text-sm text-center text-red-600 dark:text-red-400 mb-4">
              {error || 'Failed to process your request.'}
            </p>
            <button 
              type="button" 
              onClick={resetToIdle}
              className="px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIAssistPopup