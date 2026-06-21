import { TutorialStep } from "./tutorial-step";

export function ConnectSupabaseSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="创建 Supabase 项目">
        <p>
          打开{" "}
          <a
            href="https://app.supabase.com/project/_/settings/api"
            target="_blank"
            className="font-bold hover:underline text-foreground/80"
            rel="noreferrer"
          >
            database.new
          </a>{" "}
          创建一个新的 Supabase 项目。
        </p>
      </TutorialStep>

      <TutorialStep title="配置环境变量">
        <p>
          将 Next.js 项目中的{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            .env.example
          </span>{" "}
          文件重命名为{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            .env.local
          </span>{" "}
          ，并填入来自{" "}
          <a
            href="https://app.supabase.com/project/_/settings/api"
            target="_blank"
            className="font-bold hover:underline text-foreground/80"
            rel="noreferrer"
          >
            Supabase 项目 API Settings
          </a>
          的配置信息。
        </p>
      </TutorialStep>

      <TutorialStep title="重启开发服务器">
        <p>
          退出当前运行的 Next.js 开发服务器，然后重新执行{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            npm run dev
          </span>{" "}
          以加载新的环境变量。
        </p>
      </TutorialStep>

      <TutorialStep title="刷新页面">
        <p>
          如果环境变量仍未生效，请刷新页面让 Next.js 获取最新配置。
        </p>
      </TutorialStep>
    </ol>
  );
}
