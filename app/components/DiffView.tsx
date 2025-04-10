// app/components/DiffView.tsx
'use client'

import React from 'react'

interface DiffViewProps {
  original: string;
  modified: string;
  inline?: boolean;
}

interface DiffPart {
  added?: boolean;
  removed?: boolean;
  value: string;
}

const DiffView: React.FC<DiffViewProps> = ({ original, modified, inline = true }) => {
  // Simple diff implementation
  // For a more robust solution, you could use a library like 'diff' or 'jsdiff'
  const generateDiff = (originalText: string, modifiedText: string): DiffPart[] => {
    // This is a very simple character-by-character comparison
    // A real implementation would use a proper diff algorithm
    const diff: DiffPart[] = []
    
    let i = 0, j = 0
    
    while (i < originalText.length || j < modifiedText.length) {
      if (i < originalText.length && j < modifiedText.length && originalText[i] === modifiedText[j]) {
        // Characters match, add as unchanged
        let value = originalText[i]
        i++
        j++
        
        // Group consecutive unchanged characters
        while (i < originalText.length && j < modifiedText.length && originalText[i] === modifiedText[j]) {
          value += originalText[i]
          i++
          j++
        }
        
        diff.push({ value })
      } else {
        // Handle removed characters from original
        if (i < originalText.length) {
          let value = originalText[i]
          i++
          
          // Group consecutive removed characters
          while (i < originalText.length && (j >= modifiedText.length || originalText[i] !== modifiedText[j])) {
            value += originalText[i]
            i++
          }
          
          diff.push({ removed: true, value })
        }
        
        // Handle added characters from modified
        if (j < modifiedText.length) {
          let value = modifiedText[j]
          j++
          
          // Group consecutive added characters
          while (j < modifiedText.length && (i >= originalText.length || originalText[i] !== modifiedText[j])) {
            value += modifiedText[j]
            j++
          }
          
          diff.push({ added: true, value })
        }
      }
    }
    
    return diff
  }

  const diff = generateDiff(original, modified)

  if (inline) {
    return (
      <div className="font-mono text-sm whitespace-pre-wrap">
        {diff.map((part, i) => (
          <span
            key={i}
            className={
              part.added
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : part.removed
                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 line-through'
                : ''
            }
          >
            {part.value}
          </span>
        ))}
      </div>
    )
  }

  // Split view
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border border-gray-300 dark:border-gray-700 rounded p-2 bg-gray-50 dark:bg-gray-900">
        <div className="font-medium text-xs text-gray-500 dark:text-gray-400 mb-1">Original</div>
        <div className="font-mono text-sm whitespace-pre-wrap">
          {original}
        </div>
      </div>
      <div className="border border-gray-300 dark:border-gray-700 rounded p-2 bg-gray-50 dark:bg-gray-900">
        <div className="font-medium text-xs text-gray-500 dark:text-gray-400 mb-1">Modified</div>
        <div className="font-mono text-sm whitespace-pre-wrap">
          {modified}
        </div>
      </div>
    </div>
  )
}

export default DiffView