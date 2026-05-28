// src/data/categories.ts — 模板分类定义

export interface Category {
  id: string
  name: string
  nameZh: string
  description: string
  icon: string
  slug: string
  order: number
}

export const categories: Category[] = [
  { id: 'flowchart', name: 'Flowcharts', nameZh: '流程图', description: 'Process and workflow diagrams', icon: '🔀', slug: 'flowchart', order: 1 },
  { id: 'mindmap', name: 'Mind Maps', nameZh: '思维导图', description: 'Brainstorming and idea organization', icon: '🧠', slug: 'mindmap', order: 2 },
  { id: 'wireframe', name: 'Wireframes', nameZh: '线框图', description: 'UI/UX design mockups', icon: '📱', slug: 'wireframe', order: 3 },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}
