// src/components/react/ExcalidrawEditor.tsx — Excalidraw 编辑器封装
import { useState, useEffect } from 'react'

export interface EditorProps {
  initialData?: object
  templateSlug?: string
  locale?: 'en' | 'zh'
}

export default function ExcalidrawEditor({ initialData, templateSlug, locale = 'en' }: EditorProps) {
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    // 动态导入 Excalidraw（仅客户端）
    import('@excalidraw/excalidraw')
      .then((mod) => setComp(() => mod.Excalidraw))
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{locale === 'zh' ? '编辑器加载失败，请刷新页面。' : 'Editor failed to load. Please refresh.'}</p>
      </div>
    )
  }

  if (!Comp) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse">{locale === 'zh' ? '编辑器加载中...' : 'Loading editor...'}</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <Comp
        initialData={initialData ? { elements: (initialData as any).elements ?? [], appState: {} } : undefined}
        langCode={locale === 'zh' ? 'zh-CN' : 'en'}
        UIOptions={{ canvasActions: { saveToActiveFile: false } }}
      />
    </div>
  )
}
