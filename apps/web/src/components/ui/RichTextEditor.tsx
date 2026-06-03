import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Quote } from 'lucide-react'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = 'Descreva seu equipamento...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('URL do link:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border border-steel-200 rounded-xl overflow-hidden focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-100 transition-colors">
      <div className="flex gap-0.5 p-2 border-b border-steel-100 bg-steel-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-teal-100 text-teal-700' : 'text-steel-500 hover:bg-steel-100'}`}
          title="Negrito"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-teal-100 text-teal-700' : 'text-steel-500 hover:bg-steel-100'}`}
          title="Itálico"
        >
          <Italic size={16} />
        </button>
        <div className="w-px bg-steel-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-teal-100 text-teal-700' : 'text-steel-500 hover:bg-steel-100'}`}
          title="Lista"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-teal-100 text-teal-700' : 'text-steel-500 hover:bg-steel-100'}`}
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </button>
        <div className="w-px bg-steel-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-teal-100 text-teal-700' : 'text-steel-500 hover:bg-steel-100'}`}
          title="Citação"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-teal-100 text-teal-700' : 'text-steel-500 hover:bg-steel-100'}`}
          title="Adicionar link"
        >
          <LinkIcon size={16} />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-steel-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  )
}