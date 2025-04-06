import React from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { CalloutType } from '../extensions/CalloutExtension'

const CalloutComponent: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  extension,
  editor,
  getPos,
  selected,
}) => {
  const calloutType = node.attrs.calloutType as CalloutType
  
  const iconMap = {
    'information': <Info size={18} className="text-info" />,
    'best-practice': <CheckCircle2 size={18} className="text-best" />,
    'warning': <AlertTriangle size={18} className="text-warning" />,
    'error': <AlertCircle size={18} className="text-error" />,
  }
  
  const titleMap = {
    'information': 'Information',
    'best-practice': 'Best Practice',
    'warning': 'Warning',
    'error': 'Error',
  }
  
  // Function to cycle through callout types
  const changeCalloutType = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent editor focus loss
    
    const types: CalloutType[] = ['information', 'best-practice', 'warning', 'error']
    const currentIndex = types.indexOf(calloutType)
    const nextIndex = (currentIndex + 1) % types.length
    updateAttributes({ calloutType: types[nextIndex] })
  }
  
  // Function to delete the callout
  const deleteCallout = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (typeof getPos === 'function') {
      const pos = getPos()
      const { state } = editor
      const nodeSize = node.nodeSize
      
      const tr = state.tr.delete(pos, pos + nodeSize)
      editor.view.dispatch(tr)
    }
  }
  
  return (
    <NodeViewWrapper 
      className={`callout ${calloutType} ${selected ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''}`}
      data-callout-type={calloutType}
    >
      <div className="flex relative">
        <div 
          className="callout-icon cursor-pointer mt-0.5 flex-shrink-0 hover:bg-opacity-20 hover:bg-gray-500 p-1 rounded" 
          onClick={changeCalloutType}
          title={`${titleMap[calloutType]} callout (click to change type)`}
        >
          {iconMap[calloutType]}
        </div>
        <NodeViewContent className="callout-content ml-2 w-full" />
        <button
          className="delete-callout absolute top-0 right-0 cursor-pointer flex-shrink-0 hover:bg-opacity-20 hover:bg-red-500 p-1 rounded"
          onClick={deleteCallout}
          title="Delete callout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error dark:text-error">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </NodeViewWrapper>
  )
}

export default CalloutComponent
