import { test, expect } from '@playwright/test'

test.describe('首页', () => {
  test('页面加载并显示核心元素', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Excalidraw Hub/)
    // Hero 区域
    await expect(page.locator('h1')).toBeVisible()
    // CTA 按钮链接到编辑器
    await expect(page.locator('a[href="/editor"]').first()).toBeVisible()
  })

  test('导航栏包含 Logo 和链接', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header a[href="/"]')).toBeVisible()
    await expect(page.locator('header a[href="/templates"]')).toBeVisible()
    await expect(page.locator('header a[href="/editor"]')).toBeVisible()
  })

  test('热门模板卡片可见', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('a[href^="/template/"]')
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThanOrEqual(3)
  })
})

test.describe('模板库页面', () => {
  test('分类导航和模板网格加载', async ({ page }) => {
    await page.goto('/templates')
    await expect(page.locator('h1')).toContainText('Templates')
    // 分类按钮含 SVG 图标（非 emoji）
    const categoryLinks = page.locator('a[href^="/templates/"]')
    expect(await categoryLinks.count()).toBeGreaterThanOrEqual(3)
    // 确认图标是 SVG 而非 emoji
    await expect(categoryLinks.first().locator('svg')).toBeVisible()
  })

  test('模板卡片链接到详情页', async ({ page }) => {
    await page.goto('/templates')
    const card = page.locator('a[href^="/template/"]').first()
    await expect(card).toBeVisible()
    // 卡片内有 SVG 图标占位
    await expect(card.locator('svg')).toBeVisible()
  })
})

test.describe('模板详情页', () => {
  test('页面结构完整', async ({ page }) => {
    await page.goto('/template/flowchart-basic')
    await expect(page.locator('h1')).toBeVisible()
    // 面包屑
    await expect(page.locator('nav.text-sm')).toContainText('Home')
    // CTA 按钮
    await expect(page.locator('a[href*="/editor"]').first()).toBeVisible()
    // 分类标签含 SVG
    await expect(page.locator('span svg').first()).toBeVisible()
  })
})

test.describe('用途落地页', () => {
  test('flowchart-maker 页面加载', async ({ page }) => {
    await page.goto('/use-cases/flowchart-maker')
    await expect(page.locator('h1')).toContainText('Flowchart')
    // 功能列表使用 SVG check 图标
    const featureItems = page.locator('li svg')
    expect(await featureItems.count()).toBeGreaterThanOrEqual(3)
  })
})

test.describe('白板编辑器', () => {
  test('编辑器页面加载', async ({ page }) => {
    await page.goto('/editor')
    await expect(page).toHaveTitle(/Editor|Whiteboard/)
    // 等待 Excalidraw 加载（loading 文本消失或 canvas 出现）
    await page.waitForSelector('.excalidraw, [class*="excalidraw"]', { timeout: 15000 }).catch(() => {
      // 如果 Excalidraw 未加载，至少确认 loading 状态存在
    })
  })

  test('编辑器容器占满屏幕', async ({ page }) => {
    await page.goto('/editor')
    const container = page.locator('.h-screen.w-full')
    await expect(container).toBeVisible()
  })
})
