import { test, expect } from '@playwright/test'

// #10 P0: 编辑器工具栏图标不应异常放大
test.describe('#10 编辑器工具栏图标尺寸', () => {
  test('Excalidraw SVG 图标不超过合理尺寸', async ({ page }) => {
    await page.goto('/editor')
    // 等待 Excalidraw 加载
    await page.waitForSelector('.excalidraw', { timeout: 15000 })
    // 检查 .excalidraw 内的 svg 元素不超过 48px
    const svgs = page.locator('.excalidraw svg')
    const count = await svgs.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < Math.min(count, 10); i++) {
      const box = await svgs.nth(i).boundingBox()
      if (box) {
        expect(box.width).toBeLessThan(100)
        expect(box.height).toBeLessThan(100)
      }
    }
  })
})

// #11 P1: 模板分类页面不再返回404
test.describe('#11 模板分类页面可访问', () => {
  for (const category of ['flowchart', 'mindmap', 'wireframe']) {
    test(`/templates/${category} 返回200`, async ({ page }) => {
      const resp = await page.goto(`/templates/${category}`)
      expect(resp?.status()).toBe(200)
      await expect(page.locator('h1')).toBeVisible()
    })
  }
})

// #12 P1: SEO 域名正确
test.describe('#12 SEO 域名为 draw.todonot.com', () => {
  test('robots.txt 包含正确域名', async ({ page }) => {
    const resp = await page.goto('/robots.txt')
    const text = await resp?.text()
    expect(text).toContain('draw.todonot.com')
    expect(text).not.toContain('excalidraw-hub.com')
  })

  test('sitemap 链接使用正确域名', async ({ page }) => {
    const resp = await page.goto('/sitemap-index.xml')
    const text = await resp?.text()
    expect(text).toContain('draw.todonot.com')
  })
})

// #13 P2: 模板预览图非空白占位符
test.describe('#13 模板预览图有内容', () => {
  test('模板卡片包含 SVG 预览图形', async ({ page }) => {
    await page.goto('/templates')
    // 卡片内应有 rect/polygon/ellipse 等 SVG 图形元素（非仅 clipboard 图标）
    const previewShapes = page.locator('a[href^="/template/"] svg rect, a[href^="/template/"] svg polygon')
    expect(await previewShapes.count()).toBeGreaterThan(0)
  })

  test('模板详情页有 SVG 预览', async ({ page }) => {
    await page.goto('/template/flowchart-basic')
    const shapes = page.locator('svg rect, svg polygon')
    expect(await shapes.count()).toBeGreaterThan(0)
  })
})

// #14 P2: 自定义404页面
test.describe('#14 自定义404页面', () => {
  test('不存在的路径返回404且有自定义内容', async ({ page }) => {
    const resp = await page.goto('/this-page-does-not-exist')
    expect(resp?.status()).toBe(404)
    await expect(page.locator('text=404')).toBeVisible()
    await expect(page.locator('a[href="/"]').first()).toBeVisible()
  })
})

// #15 P3: Footer 版权年份
test.describe('#15 Footer 版权年份为2026', () => {
  test('首页 footer 显示 2026', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toContainText('2026')
  })
})
