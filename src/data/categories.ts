// src/data/categories.ts — 模板分类定义（使用 Lucide Icons SVG path）

export interface Category {
  id: string
  name: string
  nameZh: string
  description: string
  icon: string // Lucide SVG path data
  slug: string
  order: number
}

// Lucide icon SVG paths (viewBox="0 0 24 24", stroke-based)
export const ICON_PATHS = {
  // GitBranch — 流程图
  flowchart: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a9 9 0 0 1-9 9',
  // Brain — 思维导图
  mindmap: 'M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18ZM12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z',
  // Smartphone — 线框图
  wireframe: 'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7ZM12 17v.01',
  // ClipboardList — 模板占位
  clipboard: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01M9.5 2h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Z',
  // Check — 勾选
  check: 'M20 6 9 17l-5-5',
} as const

export const categories: Category[] = [
  { id: 'flowchart', name: 'Flowcharts', nameZh: '流程图', description: 'Process and workflow diagrams', icon: 'flowchart', slug: 'flowchart', order: 1 },
  { id: 'mindmap', name: 'Mind Maps', nameZh: '思维导图', description: 'Brainstorming and idea organization', icon: 'mindmap', slug: 'mindmap', order: 2 },
  { id: 'wireframe', name: 'Wireframes', nameZh: '线框图', description: 'UI/UX design mockups', icon: 'wireframe', slug: 'wireframe', order: 3 },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

/** 根据 icon key 获取 SVG path */
export function getIconPath(key: string): string {
  return ICON_PATHS[key as keyof typeof ICON_PATHS] ?? ICON_PATHS.clipboard
}
