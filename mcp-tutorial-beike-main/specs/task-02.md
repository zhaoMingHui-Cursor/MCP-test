- [x] **界面与交互规划**
  - 收集参考截图的配色与卡片风格，定义咖啡豆列表页面的布局、卡片样式细节（图片、名称、口感描述、标签、产地）。
  - 确定列表空态与数据加载状态的表现方式。

- [x] **数据库准备**
  - 在 Supabase 中执行 `beans` 表创建语句：
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
  - 根据需要预插入示例数据，便于本地联调。

- [x] **后端接口实现**
  - 在 `app/api/beans/route.ts` 创建 GET 接口，使用 `SUPABASE_SERVICE_ROLE_KEY` 初始化的服务端客户端读取 `beans` 表全部记录。
  - 对返回结果做基础排序（按 `created_at desc`）与错误处理，响应 JSON。

- [x] **前端数据拉取**
  - 在 `app/beans/page.tsx` 使用 `fetch` 或 `react` 数据获取 API 调用上述接口（保持 Server Component 语法），注入列表数据。
  - 处理加载失败或空数据时的兜底提示。

- [x] **UI 构建与排版**
  - 为咖啡豆列表实现参考配色的卡片栅格：展示图片、名称、口感描述、标签胶囊、产地。
  - 使用 Tailwind/shadcn 工具类统一设计（如背景米色调、圆角、阴影、强调色按钮等）。
  - 添加页面标题与简短说明，引导用户浏览。

- [x] **风格与可访问性校验**
  - 调整字体/颜色对比度，与首页保持一致的中文文案。
  - 确保所有图片具备 `alt` 文本，标签列表可被屏幕阅读器识别。

- [ ] **测试与交付**
  - 本地验证接口返回与前端渲染正确，检查登录状态下从首页进入豆页流程。
  - 更新 `AGENTS.md` 或相关文档（如有必要）记录新接口与页面说明。
