import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tiptap Callout Editor',
  description: 'A rich text editor with custom callout functionality',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-gray-900 transition-colors duration-200`}>
        <ThemeProvider>
          <main className="container mx-auto px-4 py-8 max-w-4xl">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}