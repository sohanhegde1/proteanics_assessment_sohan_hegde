'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// Default context value to prevent undefined errors
const defaultContextValue: ThemeContextType = {
  theme: 'light',
  toggleTheme: () => {},
}

const ThemeContext = createContext<ThemeContextType>(defaultContextValue)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to light mode
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  // Only runs on client side after component is mounted
  useEffect(() => {
    setMounted(true)
    
    try {
      const storedTheme = localStorage.getItem('theme') as Theme | null
      
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setTheme(storedTheme)
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark')
      } else {
        // Explicitly default to light mode if no preference is found
        setTheme('light')
      }
    } catch (error) {
      // Default to light theme if localStorage is not available
      console.error('Error accessing localStorage:', error)
    }
  }, [])

  // Update document when theme changes
  useEffect(() => {
    if (!mounted) return
    
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      localStorage.setItem('theme', theme)
    } catch (error) {
      console.error('Error setting theme:', error)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  // Provide a value object that won't change unless theme changes
  const contextValue = React.useMemo(() => {
    return { theme, toggleTheme }
  }, [theme])

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  return context
}