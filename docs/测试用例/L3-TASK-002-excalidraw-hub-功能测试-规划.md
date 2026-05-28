# L3-TASK-002 Excalidraw Hub 功能测试规划

## 关联信息
- 线上地址：https://draw.todonot.com
- 仓库：https://github.com/jinpeng-vnode/excalidraw-hub
- 测试时间：2026-05-28

## Quality Hub
- 项目 ID：fb8be307-9589-4eda-8d26-902b5326e710
- 功能点：
  - 页面加载与可用性：b29f0e25-3ab9-4641-9461-a0b88ee1c2e9
  - 绘图工具：9c722c39-172d-41af-a87d-f3e58a03f1f0
  - 编辑操作：3cd49498-59f7-4073-8fc8-541bf33c0483
  - 导航与响应式布局：4c005ff4-d485-49a8-b82d-e001e7995d25
  - 模板库系统：7e34fca4-3014-40c4-84c2-b3942afc8a0f
- 执行 run_id：61d09450-8519-4998-a44b-c53d3ffd5076

## MCP 实操结果摘要

**⛔ 阻塞性发现：所有页面返回 HTTP 502 Bad Gateway**

| 页面 | URL | HTTP 状态 | 结果 |
|------|-----|-----------|------|
| 首页 | https://draw.todonot.com/ | 502 | ❌ Bad Gateway |
| 编辑器 | https://draw.todonot.com/editor | 502 | ❌ Bad Gateway |
| 模板库 | https://draw.todonot.com/templates | 502 | ❌ Bad Gateway |

服务完全不可用，所有功能测试被阻塞。

## 用例清单

### TC-001 [Type-U] [页面加载] 首页正常加载
- Quality Hub 用例 ID：f57e784b-6438-4eb3-b851-9815ef524ecc
- 模式：B（新建）
- 步骤摘要：navigate https://draw.todonot.com/ → 验证无 502 → 验证标题
- 结果：❌ FAIL（502 Bad Gateway）

### TC-002 [Type-U] [页面加载] 编辑器页面正常加载
- Quality Hub 用例 ID：b666bad8-538c-4227-b728-a1bd1a5dd1a2
- 模式：B（新建）
- 步骤摘要：navigate /editor → 验证无 502 → 验证 canvas 存在
- 结果：❌ FAIL（502 Bad Gateway）

### TC-003 [Type-U] [页面加载] 模板页面正常加载
- Quality Hub 用例 ID：98801348-8807-4394-b5d0-85fe1d533fe3
- 模式：B（新建）
- 步骤摘要：navigate /templates → 验证无 502
- 结果：❌ FAIL（502 Bad Gateway）

### TC-004 [Type-U] [绘图工具] 矩形工具绘制
- Quality Hub 用例 ID：bd65bd22（从 run results 获取）
- 模式：B（新建）
- 步骤摘要：navigate /editor → 按 R → 拖拽绘制 → 验证
- 结果：❌ FAIL（前置页面 502）

### TC-005 [Type-U] [绘图工具] 圆形工具绘制
- 模式：B（新建）
- 步骤摘要：navigate /editor → 按 O → 拖拽绘制 → 验证
- 结果：❌ FAIL（前置页面 502）

### TC-006 [Type-U] [绘图工具] 线条工具绘制
- 模式：B（新建）
- 步骤摘要：navigate /editor → 按 L → 点击绘制 → 验证
- 结果：❌ FAIL（前置页面 502）

### TC-007 [Type-U] [绘图工具] 文字工具输入
- 模式：B（新建）
- 步骤摘要：navigate /editor → 按 T → 点击输入 → 验证
- 结果：❌ FAIL（前置页面 502）

### TC-008 [Type-U] [绘图工具] 箭头工具绘制
- 模式：B（新建）
- 步骤摘要：navigate /editor → 按 A → 点击绘制 → 验证
- 结果：❌ FAIL（前置页面 502）

### TC-009 [Type-U] [编辑操作] 选择工具选中元素
- 模式：B（新建）
- 步骤摘要：绘制矩形 → 按 V → 点击选中 → 验证
- 结果：❌ FAIL（前置页面 502）

### TC-010 [Type-U] [编辑操作] 撤销操作
- 模式：B（新建）
- 步骤摘要：绘制元素 → Ctrl+Z → 验证消失
- 结果：❌ FAIL（前置页面 502）

### TC-011 [Type-U] [编辑操作] 重做操作
- 模式：B（新建）
- 步骤摘要：绘制 → 撤销 → Ctrl+Shift+Z → 验证恢复
- 结果：❌ FAIL（前置页面 502）

### TC-012 [Type-U] [编辑操作] 导出为 PNG
- 模式：B（新建）
- 步骤摘要：绘制元素 → Ctrl+Shift+E → 验证导出
- 结果：❌ FAIL（前置页面 502）

### TC-013 [Type-U] [编辑操作] 颜色选择器切换颜色
- 模式：B（新建）
- 步骤摘要：绘制矩形 → 选中 → 切换颜色 → 验证
- 结果：❌ FAIL（前置页面 502）

### TC-014 [Type-U] [编辑操作] 缩放功能
- 模式：B（新建）
- 步骤摘要：Ctrl+= 放大 → Ctrl+- 缩小 → 验证
- 结果：❌ FAIL（前置页面 502）

### TC-015 [Type-U] [导航] 首页到编辑器导航
- 模式：B（新建）
- 步骤摘要：首页 → 点击编辑器链接 → 验证跳转
- 结果：❌ FAIL（前置页面 502）

### TC-016 [Type-U] [导航] 首页到模板页导航
- 模式：B（新建）
- 步骤摘要：首页 → 点击模板链接 → 验证跳转
- 结果：❌ FAIL（前置页面 502）

### TC-017 [Type-U] [响应式] 移动端视口
- 模式：B（新建）
- 步骤摘要：375x667 视口 → 访问首页 → 验证显示
- 结果：❌ FAIL（前置页面 502）

### TC-018 [Type-U] [响应式] 平板视口
- 模式：B（新建）
- 步骤摘要：768x1024 视口 → 访问编辑器 → 验证工具栏
- 结果：❌ FAIL（前置页面 502）

### TC-019 [Type-U] [模板库] 模板列表加载
- 模式：B（新建）
- 步骤摘要：访问 /templates → 验证模板卡片
- 结果：❌ FAIL（前置页面 502）

### TC-020 [Type-U] [模板库] 点击模板进入编辑
- 模式：B（新建）
- 步骤摘要：模板页 → 点击模板 → 验证跳转编辑器
- 结果：❌ FAIL（前置页面 502）

## 结论

**P0 阻塞性问题**：draw.todonot.com 服务完全不可用（HTTP 502 Bad Gateway），所有 20 个测试用例均无法正常执行。需要先修复服务部署问题后才能进行功能测试。
