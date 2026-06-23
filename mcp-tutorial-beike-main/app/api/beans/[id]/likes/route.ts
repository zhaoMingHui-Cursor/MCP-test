import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "请先登录后再操作。" },
        { status: 401 },
      ),
    };
  }

  return { ok: true as const, userId: data.user.id };
}

function parseBeanId(id: string) {
  if (!UUID_RE.test(id)) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "咖啡豆 ID 格式不正确。" },
        { status: 400 },
      ),
    };
  }

  return { ok: true as const, beanId: id };
}

async function ensureBeanExists(beanId: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("beans")
    .select("id")
    .eq("id", beanId)
    .maybeSingle();

  if (error) {
    console.error("[bean likes] check bean exists error:", error);
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "验证咖啡豆信息失败，请稍后再试。" },
        { status: 500 },
      ),
    };
  }

  if (!data) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "咖啡豆不存在。" }, { status: 404 }),
    };
  }

  return { ok: true as const };
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const auth = await getAuthenticatedUserId();
    if (!auth.ok) {
      return auth.response;
    }

    const parsed = parseBeanId(id);
    if (!parsed.ok) {
      return parsed.response;
    }

    const beanCheck = await ensureBeanExists(parsed.beanId);
    if (!beanCheck.ok) {
      return beanCheck.response;
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("bean_likes")
      .insert({
        bean_id: parsed.beanId,
        user_id: auth.userId,
      })
      .select("id, bean_id, user_id, liked_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "您已点赞该咖啡豆。" },
          { status: 409 },
        );
      }

      console.error("[POST /api/beans/[id]/likes] Supabase error:", error);
      return NextResponse.json(
        { error: "点赞失败，请稍后再试。" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/beans/[id]/likes] Unexpected error:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const auth = await getAuthenticatedUserId();
    if (!auth.ok) {
      return auth.response;
    }

    const parsed = parseBeanId(id);
    if (!parsed.ok) {
      return parsed.response;
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("bean_likes")
      .delete()
      .eq("bean_id", parsed.beanId)
      .eq("user_id", auth.userId)
      .select("id, bean_id, user_id, liked_at")
      .maybeSingle();

    if (error) {
      console.error("[DELETE /api/beans/[id]/likes] Supabase error:", error);
      return NextResponse.json(
        { error: "取消点赞失败，请稍后再试。" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "您尚未点赞该咖啡豆。" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[DELETE /api/beans/[id]/likes] Unexpected error:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}
