import { AuthApiError } from "@supabase/supabase-js";

function getErrorCode(error: unknown): string | undefined {
  if (error instanceof AuthApiError) {
    return error.code;
  }

  if (error instanceof Error && "code" in error) {
    return (error as { code?: string }).code;
  }

  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  const message = getErrorMessage(error);
  const code = getErrorCode(error);

  if (
    code === "over_email_send_rate_limit" ||
    message.includes("email rate limit exceeded")
  ) {
    return "注册邮件发送过于频繁。开发环境请刷新页面后重试（已启用免邮件注册）；生产环境请约 1 小时后再试。";
  }

  if (
    code === "email_exists" ||
    message.includes("already been registered") ||
    message.includes("already registered")
  ) {
    return "该邮箱已注册，请直接登录。";
  }

  return fallback;
}
