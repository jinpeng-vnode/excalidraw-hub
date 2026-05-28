# L1-TASK-001 Excalidraw 在线白板工具站 架构设计文档

## 1. 需求摘要

基于 @excalidraw/excalidraw（v0.18.1，MIT，React 组件）构建在线白板工具站：
- **核心功能**：白板编辑器 + 模板库 + 品牌定制
- **核心目标**：SEO 驱动，通过 Programmatic SEO 为每种模板/用途生成独立落地页，1个月上 Google 首页
- **部署约束**：纯前端静态站，Docker + Nginx，部署到 Mac Mini，禁止后端服务

## 2. 方案选择

### 2.1 SSG 框架选型

| 方案 | 优点 | 缺点 | 选择 |
|------|------|------|------|
| **Next.js (SSG)** | React 生态原生支持、SSG 成熟、SEO 友好、动态路由生成 | 需 Node 运行时（但 `next export` 可纯静态） | ❌ |
| **Astro + React** | 零 JS 默认、Islands 架构、构建产物纯静态 HTML、SEO 极佳 | 需学习 Astro 语法 | ✅ 选择 |
| **Vite + React + react-snap** | 简单、Vite 快 | SEO 预渲染不够灵活、路由生成弱 | ❌ |

**选择理由**：Astro 天然产出纯静态 HTML（无需 Node 运行时），Islands 架构让落地页零 JS 加载（SEO 极佳），仅白板编辑器页面加载 React 组件。完美匹配"纯前端静态站 + SEO 核心目标"的约束。

### 2.2 关键技术决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 构建工具 | Astro 内置 Vite | 快速、零配置 |
| UI 框架 | React（仅编辑器页面） | Excalidraw 是 React 组件 |
| 落地页渲染 | Astro 静态页面（零 JS） | SEO 最优 |
| 样式方案 | Tailwind CSS | 原子化、构建时清除、体积小 |
| 模板数据 | JSON/YAML 文件（Content Collections） | 纯静态、构建时生成页面 |
| 包管理器 | yarn | 项目规范要求 |

## 3. 文件结构

```
excalidraw-hub/
├── design/                          # 设计文档
│   └── L1-TASK-001-architecture.md
├── src/
│   ├── components/                  # 通用组件
│   │   ├── Header.astro             # 顶部导航栏（品牌 Logo + 导航）
│   │   ├── Footer.astro             # 页脚（SEO 内链 + 版权）
│   │   ├── AdSlot.astro             # 广告位组件
│   │   ├── TemplateCard.astro       # 模板卡片（列表页用）
│   │   └── SeoHead.astro            # SEO 元标签统一组件
│   ├── components/react/            # React 组件（Islands）
│   │   ├── ExcalidrawEditor.tsx     # Excalidraw 编辑器封装
│   │   └── TemplatePreview.tsx      # 模板预览（缩略图渲染）
│   ├── content/                     # Content Collections（模板数据）
│   │   ├── config.ts                # Collection schema 定义
│   │   └── templates/               # 模板 JSON 文件
│   │       ├── flowchart-basic.json
│   │       ├── mindmap-project.json
│   │       └── ...
│   ├── data/
│   │   └── categories.ts            # 模板分类定义
│   ├── layouts/
│   │   ├── BaseLayout.astro         # 基础布局（含 SEO Head）
│   │   ├── LandingLayout.astro      # 落地页布局（Programmatic SEO）
│   │   └── EditorLayout.astro       # 编辑器全屏布局
│   ├── pages/
│   │   ├── index.astro              # 首页（工具介绍 + 热门模板）
│   │   ├── editor.astro             # 白板编辑器页面
│   │   ├── templates/
│   │   │   ├── index.astro          # 模板分类总览页
│   │   │   └── [category].astro     # 分类列表页（动态路由）
│   │   ├── template/
│   │   │   └── [slug].astro         # 模板详情/落地页（Programmatic SEO 核心）
│   │   ├── use-cases/
│   │   │   └── [slug].astro         # 用途落地页（如 "flowchart-maker"）
│   │   └── [...lang]/               # 多语言路由（i18n）
│   │       └── ...                   # 镜像上述页面结构
│   ├── i18n/
│   │   ├── en.json                  # 英文
│   │   ├── zh.json                  # 中文
│   │   └── utils.ts                 # i18n 工具函数
│   ├── styles/
│   │   └── global.css               # 全局样式 + Tailwind 入口
│   └── utils/
│       ├── seo.ts                   # SEO 工具（Schema.org 生成、OG 标签）
│       ├── sitemap.ts               # Sitemap 辅助
│       └── template.ts              # 模板数据处理工具
├── public/
│   ├── robots.txt                   # 爬虫规则
│   ├── favicon.svg                  # 品牌图标
│   └── og/                          # OG 图片（构建时生成）
├── scripts/
│   └── generate-og-images.ts        # OG 图片批量生成脚本
├── astro.config.mjs                 # Astro 配置
├── tailwind.config.mjs              # Tailwind 配置
├── tsconfig.json                    # TypeScript 配置
├── package.json
├── Dockerfile                       # 多阶段构建
├── docker-compose.yml               # 容器编排
└── nginx.conf                       # Nginx 静态托管配置
```

## 4. 类型定义

```typescript
// src/content/config.ts — Content Collection Schema
import { defineCollection, z } from 'astro:content'

// 模板数据 schema
export const templateSchema = z.object({
  // 基础信息
  slug: z.string(),                    // URL 标识符，如 "flowchart-basic"
  title: z.string(),                   // 模板标题
  description: z.string(),             // 模板描述（SEO meta description）
  category: z.string(),                // 所属分类 ID
  tags: z.array(z.string()),           // 标签（用于关联推荐）
  // SEO 字段
  seoTitle: z.string(),                // SEO 标题（可与 title 不同）
  seoDescription: z.string(),          // SEO 描述
  keywords: z.array(z.string()),       // 目标关键词
  // 模板内容
  excalidrawData: z.any(),             // Excalidraw JSON 数据（画布内容）
  thumbnailUrl: z.string().optional(), // 缩略图路径（构建时生成）
  // 元数据
  locale: z.enum(['en', 'zh']).default('en'),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Template = z.infer<typeof templateSchema>

// src/data/categories.ts — 模板分类
export interface Category {
  id: string           // 如 "flowchart"
  name: string         // 显示名称
  nameZh: string       // 中文名称
  description: string  // 分类描述
  icon: string         // 图标标识
  slug: string         // URL 路径
  order: number        // 排序权重
}

// src/utils/seo.ts — SEO 数据结构
export interface SeoMeta {
  title: string
  description: string
  keywords: string[]
  ogImage: string
  ogType: 'website' | 'article'
  canonical: string
  hreflang: { lang: string; url: string }[]
  schema: SchemaOrgData
}

export interface SchemaOrgData {
  '@context': 'https://schema.org'
  '@type': 'SoftwareApplication' | 'WebPage' | 'ItemList'
  name: string
  description: string
  applicationCategory?: string
  offers?: { '@type': 'Offer'; price: '0'; priceCurrency: 'USD' }
  [key: string]: unknown
}

// src/components/react/ExcalidrawEditor.tsx — 编辑器 Props
export interface EditorProps {
  initialData?: object    // 初始 Excalidraw JSON（加载模板时传入）
  templateSlug?: string   // 当前模板标识
  locale?: 'en' | 'zh'   // 语言
}
```

## 5. 外部接口

本项目为纯前端静态站，无后端 API。"接口"指页面路由和数据流。

### 5.1 页面路由表

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 工具介绍 + 热门模板 + CTA |
| `/editor` | 编辑器 | 全屏白板编辑器 |
| `/editor?template={slug}` | 编辑器（带模板） | 加载指定模板数据 |
| `/templates` | 模板总览 | 所有分类入口 |
| `/templates/{category}` | 分类列表 | 该分类下所有模板 |
| `/template/{slug}` | 模板落地页 | Programmatic SEO 核心页面 |
| `/use-cases/{slug}` | 用途落地页 | 如 /use-cases/flowchart-maker |
| `/zh/...` | 中文版镜像 | 所有页面的中文版本 |

### 5.2 数据流

```
构建时：
  templates/*.json → Astro Content Collections → 静态 HTML 页面
  categories.ts → 分类页面路由生成
  i18n/*.json → 多语言页面生成

运行时：
  用户访问落地页 → 纯静态 HTML（零 JS）→ 点击"使用模板"
  → 跳转 /editor?template={slug} → React Island 加载 Excalidraw
  → 从 public/templates/{slug}.json 加载模板数据
```

## 6. 模块依赖

```mermaid
graph TD
    A[Astro 构建系统] --> B[Content Collections]
    A --> C[Pages 路由生成]
    A --> D[Islands 架构]

    B --> E[templates/*.json 模板数据]
    B --> F[categories.ts 分类数据]

    C --> G[落地页 /template/slug]
    C --> H[分类页 /templates/category]
    C --> I[用途页 /use-cases/slug]
    C --> J[编辑器 /editor]

    D --> K[ExcalidrawEditor.tsx]
    D --> L[TemplatePreview.tsx]

    K --> M[@excalidraw/excalidraw]
    K --> E

    N[SeoHead.astro] --> O[seo.ts 工具]
    O --> P[Schema.org JSON-LD]
    O --> Q[Open Graph 标签]
    O --> R[hreflang 标签]

    S[Tailwind CSS] --> C
    T[i18n/*.json] --> C
```

## 7. 错误处理

| 场景 | 处理方式 | 前端展示 |
|------|----------|----------|
| 模板 JSON 加载失败 | try-catch + fallback 空画布 | 提示"模板加载失败，已打开空白画布" |
| Excalidraw 组件加载失败 | React ErrorBoundary | 显示"编辑器加载中…请刷新重试" |
| 不存在的模板 slug | Astro 404 页面 | 自定义 404 + 推荐热门模板 |
| 浏览器不支持 | 检测 Canvas API | 提示升级浏览器 |

## 8. 模块分配表

| 模块/文件 | 负责角色 | 层级 | 依赖 |
|-----------|----------|------|------|
| `astro.config.mjs` | 前端开发者 | L2 | 本设计文档 |
| `tailwind.config.mjs` | 前端开发者 | L2 | 无 |
| `tsconfig.json` | 前端开发者 | L2 | 无 |
| `package.json` | 前端开发者 | L2 | 无 |
| `src/components/Header.astro` | 前端开发者 | L2 | UI 规格 |
| `src/components/Footer.astro` | 前端开发者 | L2 | UI 规格 |
| `src/components/AdSlot.astro` | 前端开发者 | L2 | UI 规格 |
| `src/components/TemplateCard.astro` | 前端开发者 | L2 | UI 规格 |
| `src/components/SeoHead.astro` | 前端开发者 | L2 | seo.ts |
| `src/components/react/ExcalidrawEditor.tsx` | 前端开发者 | L2 | @excalidraw/excalidraw |
| `src/components/react/TemplatePreview.tsx` | 前端开发者 | L2 | @excalidraw/excalidraw |
| `src/content/config.ts` | 前端开发者 | L2 | 本设计文档类型定义 |
| `src/content/templates/*.json` | 前端开发者 | L2 | Excalidraw 格式 |
| `src/data/categories.ts` | 前端开发者 | L2 | 无 |
| `src/layouts/*.astro` | 前端开发者 | L2 | UI 规格 |
| `src/pages/**/*.astro` | 前端开发者 | L2 | layouts + content |
| `src/i18n/*.json` | 前端开发者 | L2 | 无 |
| `src/utils/seo.ts` | 前端开发者 | L2 | 无 |
| `src/utils/template.ts` | 前端开发者 | L2 | 无 |
| `src/styles/global.css` | 前端开发者 | L2 | Tailwind |
| `Dockerfile` | 全栈工程师 | L3 | 构建产物 |
| `docker-compose.yml` | 全栈工程师 | L3 | Dockerfile |
| `nginx.conf` | 全栈工程师 | L3 | 路由表 |
| `design/ui/*.md` | UI设计员 | L1.5 | 本设计文档 |

## 9. 开发层级

### L1 — 架构设计（当前）
- 本设计文档

### L1.5 — UI 设计
- 首页 UI 规格
- 编辑器页面 UI 规格
- 模板列表/详情页 UI 规格
- 落地页 UI 规格

### L2 — 前端开发
- 项目脚手架搭建（Astro + React + Tailwind）
- Excalidraw 编辑器集成
- 模板库系统（Content Collections + 页面生成）
- SEO 组件（SeoHead、Schema.org、sitemap）
- 品牌定制（Logo、广告位、中文本地化）
- 落地页批量生成（Programmatic SEO）

### L3 — 部署上线
- Docker 多阶段构建
- Nginx 配置
- Mac Mini 部署

## 10. 依赖清单

### 前端核心依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `astro` | ^5.0.0 | SSG 框架 |
| `@astrojs/react` | ^4.0.0 | React Islands 集成 |
| `@astrojs/tailwind` | ^6.0.0 | Tailwind 集成 |
| `@astrojs/sitemap` | ^3.0.0 | sitemap.xml 自动生成 |
| `@excalidraw/excalidraw` | ^0.18.1 | 白板编辑器核心 |
| `react` | ^18.3.0 | React 运行时 |
| `react-dom` | ^18.3.0 | React DOM |
| `tailwindcss` | ^3.4.0 | 原子化 CSS |
| `typescript` | ^5.5.0 | 类型系统 |

### 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `@types/react` | ^18.3.0 | React 类型 |
| `@types/react-dom` | ^18.3.0 | React DOM 类型 |

### 系统依赖

| 工具 | 版本 | 用途 |
|------|------|------|
| `node` | ^20.0.0 | 构建环境 |
| `nginx` | ^1.25 | 静态文件托管（Docker 内） |
| `docker` | ^24.0 | 容器化 |

## 11. 开发者备注

### SEO 策略详解 — Programmatic SEO

**核心思路**：每个模板 JSON 文件在构建时自动生成一个独立的 SEO 优化落地页。

1. **落地页结构**（`/template/{slug}`）：
   - H1 标题含目标关键词（如 "Free Online Flowchart Maker"）
   - 模板预览图（静态 SVG/PNG，非 JS 渲染）
   - 结构化描述文案（200-500 字，含关键词）
   - "立即使用" CTA 按钮 → 跳转编辑器
   - 相关模板推荐（内链）
   - Schema.org SoftwareApplication 标记

2. **页面生成机制**：
   - `src/content/templates/` 下每个 JSON = 一个落地页
   - Astro `getStaticPaths()` 遍历所有模板生成路由
   - 新增模板只需添加 JSON 文件，构建自动生成页面

3. **多语言**：
   - 英文为主站（`/template/flowchart-basic`）
   - 中文为子路径（`/zh/template/flowchart-basic`）
   - hreflang 标签互相引用

### Docker 部署方案

```dockerfile
# 多阶段构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Nginx 关键配置

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback 不需要（纯静态页面）
    # 每个路由都有对应的 HTML 文件

    location / {
        try_files $uri $uri/index.html $uri.html =404;
    }

    # 缓存策略
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SEO 文件
    location = /robots.txt { }
    location = /sitemap-index.xml { }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    # gzip
    gzip on;
    gzip_types text/html text/css application/javascript application/json image/svg+xml;
}
```

### 品牌定制方案

- **Logo**：替换 Excalidraw 默认 Logo，通过 `UIOptions.dockedSidebarBreakpoint` 和自定义 `renderTopRightUI` 注入品牌元素
- **广告位**：`AdSlot.astro` 组件预留位置，落地页侧边栏 + 页脚上方
- **中文本地化**：Excalidraw 内置 i18n 支持，传入 `langCode="zh-CN"` 即可

### 扩展模板的流程

1. 用 Excalidraw 编辑器创建模板内容
2. 导出 JSON 数据
3. 创建 `src/content/templates/{slug}.json`，填入 schema 字段
4. `yarn build` 自动生成对应落地页
5. 部署更新
