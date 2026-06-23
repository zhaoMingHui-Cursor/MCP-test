# AGENTS 指南

## 项目概览
- **名称**：咖啡豆教程模板（Supabase + Next.js）
- **定位**：面向教程的咖啡豆介绍/排名站点骨架，提供登录注册能力与中文化 UI。
- **运行模式**：Next.js App Router，结合 Supabase 进行身份验证与数据访问。

## 技术栈
- **框架**：Next.js (App Router, React 19)
- **认证 & 数据库**：Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **样式**：Tailwind CSS、shadcn/ui 组件封装
- **状态/主题**：`next-themes` 管理明暗模式
- **开发工具**：TypeScript、ESLint、PostCSS

## 目录结构
- `app/`
  - `layout.tsx`：根布局与主题注入
  - `page.tsx`：落地页入口
  - `auth/`：登录、注册、密码找回等页面
  - `beans/`：咖啡豆页面占位
  - `globals.css`：全局样式（含背景色 #FFFEFC）
- `components/`
  - `navbar.tsx`：顶栏组件
  - `auth-button.tsx` & `logout-button.tsx`：基于 Supabase 的认证入口
  - `ui/`：shadcn/ui 封装组件
  - `tutorial/`：教程指导内容
- `lib/`
  - `supabase/`：前端、服务端、middleware 的 Supabase 客户端封装
  - `utils.ts`：工具函数（如 `cn`, `hasEnvVars`）
- `middleware.ts`：登录态同步（通过 Supabase middleware）
- `specs/`：任务说明（如 `task-01`）

## 环境变量
| 变量名 | 作用 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 需在 Supabase 控制台获取 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` | 浏览器侧公钥 | 仅用于前端初始化 Supabase 客户端以支持登录/注册表单 |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务端密钥 | **严禁暴露到前端**，仅在 API Route 或服务端环境中使用 |

> 建议将以上键写入 `.env.local`，并在部署平台（如 Vercel）配置对应环境变量。

## Supabase 使用规范
1. **前端**：仅使用 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` 创建 Supabase 客户端（`lib/supabase/client.ts`），用于登录、注册、密码找回等公开操作。
2. **服务端**：
   - 所有业务数据请求须通过 Next.js API Route 或 Server Action 包装，禁止直接在前端调用服务端逻辑。
   - API Route 内部使用 `SUPABASE_SERVICE_ROLE_KEY`（`lib/supabase/server.ts` 或自建封装）创建具有服务权限的 Supabase 客户端，执行增删改查。
   - 记得在接口中校验用户身份/权限，避免凭借 service role key 带来越权风险。
3. **Middleware**：`middleware.ts` 利用 Supabase 提供的 helper 同步会话，保持 SSR/Edge 渲染中的用户状态。

## 数据库表
- `beans`
  ```sql
  create table beans (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    flavor_profile text not null,
    origin text not null,
    tags text[] default array[]::text[],
    image_url text not null,
    created_at timestamptz default timezone('utc', now())
  );
  ```
- `bean_likes`（用户点赞咖啡豆）
  ```sql
  create table bean_likes (
    id uuid primary key default gen_random_uuid(),
    bean_id uuid not null references beans(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    liked_at timestamptz not null default timezone('utc', now()),
    unique (user_id, bean_id)
  );
  ```
  - `(user_id, bean_id)` 唯一约束，同一用户对同一咖啡豆只能点赞一次。
  - 已启用 RLS：登录用户可查看所有点赞、插入/删除自己的点赞记录。

> 规则：如果项目新增数据库表，必须同步在本节追加表名与建表 SQL，以便所有 agents 获取最新 schema 信息。

## API 接口
- `GET /api/beans`：返回 `beans` 表的全部记录，按 `created_at` 倒序排列。后端使用 `SUPABASE_SERVICE_ROLE_KEY` 读取数据，前端页面（`app/beans/page.tsx`）通过该接口渲染列表。
- `POST /api/beans`：创建一条咖啡豆记录。请求体 JSON 字段：`name`、`flavor_profile`、`origin`、`tags`（字符串数组）、`image_url`，全部必填且不可为空。后端校验通过后使用 `SUPABASE_SERVICE_ROLE_KEY` 写入 `beans` 表，成功返回 `201` 及新记录。
- `POST /api/beans/[id]/likes`：为指定咖啡豆点赞。路径参数 `id` 为咖啡豆 UUID。需登录，服务端从会话获取 `user_id` 后写入 `bean_likes` 表。成功返回 `201` 及点赞记录；已点赞返回 `409`；咖啡豆不存在返回 `404`；未登录返回 `401`。
- `DELETE /api/beans/[id]/likes`：取消对指定咖啡豆的点赞。路径参数 `id` 为咖啡豆 UUID。需登录，仅删除当前用户自己的点赞记录。成功返回 `200` 及被删除的记录；未点赞返回 `404`；未登录返回 `401`。

## 开发提示
- 启动开发：`npm run dev`（默认启用 Turbopack）
- Lint 检查：`npm run lint`（如需避免 `.next` 产物干扰，请先执行 `rm -rf .next`）
- 依赖管理：项目使用 npm/pnpm。若切换包管理器，请确保锁文件一致性。

如需扩展 API，请在 `app/api/...` 下创建 Route Handler，按照上述环境变量规范连接 Supabase。
