import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getSupabaseUrl } from "@/lib/supabase/url";

async function signInAndSetSession(email: string, password: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  return supabase.auth.signInWithPassword({ email, password });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 });
    }

    const admin = createServiceRoleClient();
    const { data, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError && createError.code !== "email_exists") {
      return NextResponse.json(
        { error: createError.message, code: createError.code },
        { status: 400 },
      );
    }

    const { data: signInData, error: signInError } = await signInAndSetSession(
      email,
      password,
    );

    if (signInError) {
      return NextResponse.json(
        { error: signInError.message, code: signInError.code },
        { status: 400 },
      );
    }

    return NextResponse.json({
      userId: signInData.user?.id ?? data.user?.id,
    });
  } catch (error) {
    console.error("[POST /api/auth/dev-sign-up] Unexpected error:", error);
    return NextResponse.json({ error: "开发环境注册失败" }, { status: 500 });
  }
}
