'use client'

import React from 'react'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'

const PageHeader: React.FC = () => {
  // This ensures ThemeToggle is only rendered after ThemeContext is available
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Tiptap Callout Editor</h1>
      <ThemeToggle />
    </div>
  )
}

export default PageHeader