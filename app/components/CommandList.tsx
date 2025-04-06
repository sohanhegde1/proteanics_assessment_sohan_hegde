import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Heading1, 
  Heading2,
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  CheckSquare,
  Minus
} from 'lucide-react'
import { CommandItem } from '../extensions/SlashCommands'

interface CommandListProps {
  items: CommandItem[]
  command: (props: any) => void
}

const CommandList = forwardRef((props: CommandListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command(item.command)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => {
    setSelectedIndex(0)
    
    // Set active category to first item's category
    if (props.items.length > 0) {
      setActiveCategory(props.items[0].category)
    }
  }, [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'info': return <Info size={18} className="text-info" />
      case 'check-circle': return <CheckCircle2 size={18} className="text-best" />
      case 'alert-triangle': return <AlertTriangle size={18} className="text-warning" />
      case 'alert-circle': return <AlertCircle size={18} className="text-error" />
      case 'heading-1': return <Heading1 size={18} />
      case 'heading-2': return <Heading2 size={18} />
      case 'heading-3': return <Heading3 size={18} />
      case 'list': return <List size={18} />
      case 'list-ordered': return <ListOrdered size={18} />
      case 'check-square': return <CheckSquare size={18} />
      case 'quote': return <Quote size={18} />
      case 'code': return <Code size={18} />
      case 'minus': return <Minus size={18} />
      default: return null
    }
  }

  // Group items by category
  const groupedItems: Record<string, CommandItem[]> = {}
  const categories: string[] = []
  
  props.items.forEach(item => {
    const category = item.category || 'Other'
    
    if (!groupedItems[category]) {
      groupedItems[category] = []
      categories.push(category)
    }
    
    groupedItems[category].push(item)
  })

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
  }

  // Calculate the current global index
  const getGlobalIndex = (category: string, localIndex: number): number => {
    let globalIndex = 0
    
    for (const cat of categories) {
      if (cat === category) {
        return globalIndex + localIndex
      }
      globalIndex += groupedItems[cat].length
    }
    
    return 0
  }

  return (
    <div className="flex rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 max-h-80">
      {/* Categories sidebar */}
      {categories.length > 1 && (
        <div className="border-r border-gray-200 dark:border-gray-700 w-32 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {categories.map((category) => (
            <div
              key={category}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                category === activeCategory ? 'bg-gray-200 dark:bg-gray-700 font-medium' : ''
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </div>
          ))}
        </div>
      )}
      
      {/* Commands list */}
      <div className="flex-1 min-w-[300px] overflow-y-auto max-h-80">
        {categories.map((category) => (
          <div 
            key={category} 
            className={`${category !== activeCategory && categories.length > 1 ? 'hidden' : ''}`}
          >
            <div className="sticky top-0 px-3 py-1 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {category}
            </div>
            <div className="py-1">
              {groupedItems[category].map((item, index) => {
                const globalIndex = getGlobalIndex(category, index)
                
                return (
                  <div
                    key={`${category}-${index}`}
                    className={`flex items-center px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer ${
                      globalIndex === selectedIndex ? 'bg-blue-100 dark:bg-gray-700' : ''
                    }`}
                    onClick={() => selectItem(globalIndex)}
                  >
                    <div className="mr-2 flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700">
                      {getIcon(item.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{item.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.description}</div>
                    </div>
                    {item.shortcut && (
                      <div className="ml-2 flex-shrink-0">
                        <kbd className="px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                          {item.shortcut}
                        </kbd>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        
        {props.items.length === 0 && (
          <div className="flex items-center justify-center h-20 text-gray-500 dark:text-gray-400">
            No matching commands
          </div>
        )}
      </div>
    </div>
  )
})

CommandList.displayName = 'CommandList'

export default CommandList