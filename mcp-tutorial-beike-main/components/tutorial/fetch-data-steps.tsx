import { TutorialStep } from "./tutorial-step";
import { CodeBlock } from "./code-block";

const create = `create table notes (
  id bigserial primary key,
  title text
);

insert into notes(title)
values
  ('今天我创建了一个 Supabase 项目。'),
  ('我添加了一些数据并从 Next.js 查询到了它。'),
  ('太棒了！');
`.trim();

const rls = `alter table notes enable row level security;
create policy "允许公开读取" on notes
for select
using (true);`.trim();

const server = `import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

const client = `'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('notes').select()
      setNotes(data)
    }
    getData()
  }, [])

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

export function FetchDataSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="创建数据表并插入示例数据">
        <p>
          打开{" "}
          <a
            href="https://supabase.com/dashboard/project/_/editor"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            Table Editor
          </a>{" "}
          ，在 Supabase 项目中创建数据表并插入示例数据。如果暂时没有灵感，可以将下面的 SQL 粘贴到{" "}
          <a
            href="https://supabase.com/dashboard/project/_/sql/new"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            SQL Editor
          </a>{" "}
          然后点击 RUN 执行。
        </p>
        <CodeBlock code={create} />
      </TutorialStep>

      <TutorialStep title="启用行级安全（RLS）策略">
        <p>
          Supabase 默认启用行级安全（RLS）。若要查询 <code>notes</code>{" "}
          数据表，需要为其新增访问策略。你可以在{" "}
          <a
            href="https://supabase.com/dashboard/project/_/editor"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            Table Editor
          </a>{" "}
          中完成，也可以通过{" "}
          <a
            href="https://supabase.com/dashboard/project/_/sql/new"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            SQL Editor
          </a>
          执行 SQL。
        </p>
        <p>
          例如，可以运行以下 SQL 让任何人都能读取数据：
        </p>
        <CodeBlock code={rls} />
        <p>
          想了解更多 RLS 相关内容，可参阅{" "}
          <a
            href="https://supabase.com/docs/guides/auth/row-level-security"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            Supabase 文档
          </a>
          .
        </p>
      </TutorialStep>

      <TutorialStep title="在 Next.js 中查询 Supabase 数据">
        <p>
          如果想在异步服务端组件中创建 Supabase 客户端并查询数据，可在{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            /app/notes/page.tsx
          </span>{" "}
          新建页面并加入以下代码。
        </p>
        <CodeBlock code={server} />
        <p>也可以改用客户端组件：</p>
        <CodeBlock code={client} />
      </TutorialStep>

      <TutorialStep title="探索 Supabase UI 组件库">
        <p>
          访问{" "}
          <a
            href="https://supabase.com/ui"
            className="font-bold hover:underline text-foreground/80"
          >
            Supabase UI 组件库
          </a>{" "}
          ，试试安装一些模块。例如，运行以下命令即可安装实时聊天模块：
        </p>
        <CodeBlock
          code={
            "npx shadcn@latest add https://supabase.com/ui/r/realtime-chat-nextjs.json"
          }
        />
      </TutorialStep>

      <TutorialStep title="周末搞定上线，服务百万用户！">
        <p>现在就可以将你的产品发布给世界各地的咖啡爱好者啦！🚀</p>
      </TutorialStep>
    </ol>
  );
}
