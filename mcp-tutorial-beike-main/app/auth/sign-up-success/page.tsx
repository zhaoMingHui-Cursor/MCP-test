import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                注册成功，感谢加入！
              </CardTitle>
              <CardDescription>
                {isDevelopment
                  ? "开发环境已自动完成邮箱验证并登录"
                  : "请查收邮箱完成验证"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {isDevelopment
                  ? "本地开发模式不会发送验证邮件（用于绕过 Supabase 邮件频率限制）。你的账号已可直接使用，无需查收邮箱。"
                  : "您已经完成注册。请前往邮箱点击验证链接后，再返回登录页面。"}
              </p>
              <Button asChild className="w-full">
                <Link href="/">
                  {isDevelopment ? "进入首页" : "返回首页"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
