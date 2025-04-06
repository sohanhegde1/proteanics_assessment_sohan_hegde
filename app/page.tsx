'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'
import ThemeToggle from './components/ThemeToggle'

// Import the editor component dynamically to avoid SSR issues
const TiptapEditor = dynamic(() => import('./components/TiptapEditor'), {
  ssr: false,
})

export default function Home() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tiptap Callout Editor</h1>
        <ThemeToggle />
      </div>
      
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        A text editor with custom callout functionality. Create and customize callouts using the toolbar, keyboard shortcuts, or slash commands.
      </p>
      <TiptapEditor />
      
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">About Callouts</h2>
        <p className="mb-4 dark:text-gray-300">
          Callouts are special blocks that highlight important information. This editor supports four types of callouts:
        </p>
        
        <div className="space-y-4">
          {/* Information callout - using actual callout class */}
          <div className="callout information">
            <div className="flex items-start">
              <div className="callout-icon mt-0.5 mr-2">
                <Info size={20} className="text-info" />
              </div>
              <div className="callout-content">
                <h3 className="font-medium text-info-dark dark:text-info">Information</h3>
                <p>Used for general information and helpful notes. This callout style is ideal for providing additional context or useful tips.</p>
              </div>
            </div>
          </div>
          
          {/* Best Practice callout - using actual callout class */}
          <div className="callout best-practice">
            <div className="flex items-start">
              <div className="callout-icon mt-0.5 mr-2">
                <CheckCircle2 size={20} className="text-best" />
              </div>
              <div className="callout-content">
                <h3 className="font-medium text-best-dark dark:text-best">Best Practice</h3>
                <p>Highlights recommended approaches and optimal solutions. Use this to emphasize the most effective ways to accomplish tasks.</p>
              </div>
            </div>
          </div>
          
          {/* Warning callout - using actual callout class */}
          <div className="callout warning">
            <div className="flex items-start">
              <div className="callout-icon mt-0.5 mr-2">
                <AlertTriangle size={20} className="text-warning" />
              </div>
              <div className="callout-content">
                <h3 className="font-medium text-warning-dark dark:text-warning">Warning</h3>
                <p>Used for cautionary information and potential issues. This style alerts users to proceed with care or be aware of possible problems.</p>
              </div>
            </div>
          </div>
          
          {/* Error callout - using actual callout class */}
          <div className="callout error">
            <div className="flex items-start">
              <div className="callout-icon mt-0.5 mr-2">
                <AlertCircle size={20} className="text-error" />
              </div>
              <div className="callout-content">
                <h3 className="font-medium text-error-dark dark:text-error">Error</h3>
                <p>Indicates critical issues and errors that need attention. Use this callout to highlight important problems or blocking concerns.</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          You can add callouts using the toolbar buttons, keyboard shortcuts, or by typing / at the beginning of a line and selecting from the menu.
        </p>
      </div>
    </div>
  )
}