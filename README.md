# Excalidraw Hub — 在线白板工具站

## 功能全景图 — 完成度: 0%

> 项目定义：基于 Excalidraw 开源项目的在线白板工具站，以 SEO 为核心目标，通过 Programmatic SEO 为每种模板/用途生成独立落地页，1个月内上 Google 首页。
> 当前阶段：开发中
> 下一步优先级：
> 1. 架构设计（技术方案 + SEO 策略 + 模板库设计）
> 2. 前端开发实现（Excalidraw 集成 + 品牌定制 + 模板库）
> 3. Docker 容器化部署到 Mac Mini
> 禁止：
> - 禁止修改 Mac Mini 宿主机配置（一切在 Docker 容器内完成）
> - 禁止后端服务（纯前端静态站，nginx 托管）
> - 禁止偏离 SEO 核心目标

```
excalidraw-hub
├── 白板编辑器（核心）
│   ├── Excalidraw 开源集成 — ❌
│   ├── 品牌 Logo 定制 — ❌
│   ├── 广告位预留 — ❌
│   └── 中文本地化 — ❌
├── 模板库系统
│   ├── 模板分类页面 — ❌
│   ├── 模板详情/预览页 — ❌
│   └── 模板独立落地页（Programmatic SEO）— ❌
├── SEO 优化
│   ├── sitemap.xml 自动生成 — ❌
│   ├── robots.txt — ❌
│   ├── Schema.org 结构化数据 — ❌
│   ├── Open Graph 元标签 — ❌
│   ├── hreflang 多语言标签 — ❌
│   └── 每种用途独立落地页 — ❌
├── 部署与基础设施
│   ├── Docker 容器化配置 — ❌
│   ├── Nginx 静态托管 — ❌
│   └── Mac Mini 部署 — ❌
└── 待完成
    └── 架构设计方案 — ❌
```
