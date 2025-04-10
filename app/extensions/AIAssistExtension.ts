// app/extensions/AIAssistExtension.ts
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export interface AIAssistOptions {
  shortcut?: string;
  apiEndpoint?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiAssist: {
      /**
       * Trigger AI assist for selected text
       */
      triggerAIAssist: () => ReturnType;
    }
  }
}

export const AIAssistExtension = Extension.create<AIAssistOptions>({
  name: 'aiAssist',

  addOptions() {
    return {
      shortcut: 'Shift-Mod-a', // Changed to Shift+Cmd/Ctrl+A
      apiEndpoint: '/api/ai-assist', // Default API endpoint
    }
  },

  addCommands() {
    return {
      triggerAIAssist: () => ({ editor }) => {
        const { state, view } = editor
        const { selection } = state
        
        if (selection.empty) {
          return false
        }

        // Dispatch a custom event to trigger the AI assist UI
        // This is handled by the React component wrapper
        const event = new CustomEvent('tiptap:ai-assist-trigger', {
          detail: { 
            from: selection.from, 
            to: selection.to,
            selectedText: state.doc.textBetween(selection.from, selection.to, ' ')
          },
          bubbles: true
        })
        
        view.dom.dispatchEvent(event)
        return true
      },
    }
  },

  addKeyboardShortcuts() {
    // Fix: Convert this.options.shortcut to string explicitly
    const shortcut: string = this.options.shortcut as string;
    
    return {
      [shortcut]: () => this.editor.commands.triggerAIAssist(),
    }
  },

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey('aiAssist')
    
    return [
      new Plugin({
        key: pluginKey,
        props: {
          // We'll use decorations to highlight text being processed by AI
          decorations: (state) => {
            const { doc } = state
            const decorations: Decoration[] = []
            
            // The decorations will be populated when AI processing is active
            // This will be managed through our React component
            
            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})