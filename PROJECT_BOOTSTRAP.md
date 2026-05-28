# PROJECT_BOOTSTRAP — excalidraw-hub

## 项目概述

纯前端静态站（Excalidraw 在线白板工具），Astro 构建 + nginx 托管，Docker 容器化部署。

## 服务器信息

| 项目 | 值 |
|------|-----|
| 服务器 | Mac Mini (192.168.3.9) |
| 用户 | jinpeng |
| 项目路径 | ~/projects/excalidraw-hub |
| 分支 | dev |
| 容器名 | excalidraw-hub-web-1 |
| 宿主机端口 | 9080 |
| 容器端口 | 80 (nginx) |
| 访问地址 | http://192.168.3.9:9080 |

## 技术栈

- 构建：Astro + Vite + TypeScript + Tailwind CSS
- 运行时：nginx:alpine（静态文件托管）
- 容器化：Docker + docker-compose

## 常用命令

```bash
# SSH 到服务器后（需 export PATH=/usr/local/bin:$PATH）
cd ~/projects/excalidraw-hub

# 拉取最新代码并重启（无 Dockerfile 变更）
git pull origin dev && docker compose restart

# 拉取最新代码并重新构建（有 Dockerfile/依赖变更）
git pull origin dev && docker compose up -d --build

# 查看容器状态
docker ps --filter name=excalidraw-hub

# 查看容器日志
docker compose logs -f web

# 停止服务
docker compose down
```

## 注意事项

- SSH 连接后 PATH 不含 `/usr/local/bin`，需手动 export 或使用完整路径 `/usr/local/bin/docker`
- Docker Hub 拉取可能超时，Dockerfile 中使用 `nginx:alpine`（已有本地缓存）
- 宿主机 8088 端口已被占用，使用 9080 端口
- ⛔ 禁止修改宿主机任何配置，一切在 Docker 容器内完成
