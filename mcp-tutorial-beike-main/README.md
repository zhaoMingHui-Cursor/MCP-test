# 咖啡豆教程模板

基于 Next.js App Router 与 Supabase 打造的中文化咖啡豆教程网站模板，提供登录注册、咖啡豆列表展示、API 封装等基础能力，便于快速开展定制化教学或内容管理。

## 技术栈
- **Next.js 14**（App Router、Server/Client Component 混合渲染）
- **React 19**
- **Supabase**（身份认证、数据库、边缘中间件）
- **Tailwind CSS + shadcn/ui**（组件与样式）
- **TypeScript / ESLint / PostCSS**

## 本地运行
1. **安装依赖**
   ```bash
   npm install
   # 或者
   pnpm install
   ```
2. **复制环境变量模版**
   ```bash
   cp .env.example .env.local
   ```
3. **配置 Supabase 项目参数（见下文环境变量说明）**
4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   默认会运行在 `http://localhost:3000`。

5. **代码检查（可选）**
   ```bash
   npm run lint
   ```
6. **构建 & 预览（可选）**
   ```bash
   npm run build
   npm run start
   ```

## 环境变量
在 `.env.local` 中填入以下键值，可从 Supabase 控制台 **Project Settings > API** 页面获取：

```bash
# Update these with your Supabase details from your project settings > API
# https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> 说明：
> - `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` 用于前端初始化 Supabase 客户端，仅涉及公开功能（登录、注册等）。
> - `SUPABASE_SERVICE_ROLE_KEY` 仅能在服务端（如 API Route）使用，用于访问受保护的数据库操作。务必 **不要公开**。

## 项目结构简介
- `app/`：Next.js App Router 页面与 API
  - `page.tsx`：首页落地页
  - `beans/`：咖啡豆列表页面
  - `api/beans/route.ts`：咖啡豆数据接口
  - `auth/`：登录、注册、密码找回等页面
- `components/`：导航、认证按钮、UI 组件、咖啡豆列表等
- `lib/supabase/`：Supabase 客户端封装（浏览器 / 服务端 / Service Role）
- `specs/`：任务拆分与执行说明
- `public/`：静态资源（咖啡豆示例图片等）

详细的目录、数据库建表及接口说明见 [`AGENTS.md`](./AGENTS.md)。

## 约定与注意事项
- 所有业务数据请求统一走 API Route，后端使用 `SUPABASE_SERVICE_ROLE_KEY` 访问数据库。
- 新增数据库表后，需在 `AGENTS.md` 同步记录表结构与建表 SQL。
- 所有页面文案默认中文化，保持与设计调性一致。
- 若需扩展 UI，可使用 shadcn/ui 组件库或 Tailwind 自定义样式。

如在配置或运行中遇到问题，可参考 Supabase 官方文档或在仓库 Issue 中反馈。祝开发顺利！☕️
