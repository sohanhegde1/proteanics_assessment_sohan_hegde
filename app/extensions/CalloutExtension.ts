import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import CalloutComponent from '../components/CalloutComponent'

export type CalloutType = 'information' | 'best-practice' | 'warning' | 'error'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      /**
       * Set a callout
       */
      setCallout: (calloutType: CalloutType) => ReturnType
      /**
       * Toggle a callout
       */
      toggleCallout: (calloutType: CalloutType) => ReturnType
      /**
       * Update callout type
       */
      updateCalloutType: (calloutType: CalloutType) => ReturnType
    }
  }
}

export const CalloutExtension = Node.create({
  name: 'callout',
  
  group: 'block',
  
  // Allow any blocks inside callouts EXCEPT callouts
  content: 'block+',
  
  defining: true,
  
  isolating: true,

  // Prevent nesting of callouts
  allowGapCursor: false,
  
  addAttributes() {
    return {
      calloutType: {
        default: 'information',
        parseHTML: element => element.getAttribute('data-callout-type'),
        renderHTML: attributes => {
          return {
            'data-callout-type': attributes.calloutType,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=callout]',
        getAttrs: element => {
          if (typeof element === 'string') return {}
          
          const calloutTypes: CalloutType[] = ['information', 'best-practice', 'warning', 'error']
          const classList = (element as HTMLElement).classList
          
          const type = calloutTypes.find(type => classList.contains(type))
          
          return {
            calloutType: type || 'information',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { calloutType } = HTMLAttributes
    
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: `callout ${calloutType}`,
        'data-callout-type': calloutType,
      }),
      0, // This tells Tiptap to render the content directly within this element
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent)
  },

  addCommands() {
    return {
      setCallout:
        (calloutType: CalloutType) =>
        ({ commands, editor }) => {
          // Check if we're already inside a callout to prevent nesting
          if (editor.isActive('callout')) {
            return false
          }
          
          return commands.wrapIn(this.name, { calloutType })
        },
      toggleCallout:
        (calloutType: CalloutType) =>
        ({ commands, editor }) => {
          // If already in a callout, unwrap instead of trying to nest another callout
          if (editor.isActive('callout')) {
            return commands.lift(this.name)
          }
          
          return commands.toggleWrap(this.name, { calloutType })
        },
      updateCalloutType:
        (calloutType: CalloutType) =>
        ({ commands, editor }) => {
          const { selection } = editor.state
          
          if (!selection) return false
          
          return commands.updateAttributes(this.name, { calloutType })
        },
    }
  },
})

export default CalloutExtension