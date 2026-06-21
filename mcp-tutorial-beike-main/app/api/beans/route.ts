import { NextResponse } from "next/server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

type CreateBeanPayload = {
  name: string;
  flavor_profile: string;
  origin: string;
  tags: string[];
  image_url: string;
};

function parseCreateBeanPayload(body: unknown):
  | { ok: true; data: CreateBeanPayload }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "请求体格式不正确。" };
  }

  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const flavorProfile =
    typeof record.flavor_profile === "string"
      ? record.flavor_profile.trim()
      : "";
  const origin =
    typeof record.origin === "string" ? record.origin.trim() : "";
  const imageUrl =
    typeof record.image_url === "string" ? record.image_url.trim() : "";

  if (!name) {
    return { ok: false, error: "咖啡名称不能为空。" };
  }

  if (!flavorProfile) {
    return { ok: false, error: "口味描述不能为空。" };
  }

  if (!origin) {
    return { ok: false, error: "产地不能为空。" };
  }

  if (!imageUrl) {
    return { ok: false, error: "图片链接不能为空。" };
  }

  if (!Array.isArray(record.tags)) {
    return { ok: false, error: "标签必须是字符串数组。" };
  }

  const tags = record.tags
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (tags.length === 0) {
    return { ok: false, error: "至少填写一个标签。" };
  }

  return {
    ok: true,
    data: {
      name,
      flavor_profile: flavorProfile,
      origin,
      tags,
      image_url: imageUrl,
    },
  };
}

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("beans")
      .select(
        "id, name, flavor_profile, origin, tags, image_url, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/beans] Supabase error:", error);
      return NextResponse.json(
        { error: "获取咖啡豆数据失败，请稍后再试。" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("[GET /api/beans] Unexpected error:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const parsed = parseCreateBeanPayload(await request.json());

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("beans")
      .insert(parsed.data)
      .select(
        "id, name, flavor_profile, origin, tags, image_url, created_at",
      )
      .single();

    if (error) {
      console.error("[POST /api/beans] Supabase error:", error);
      return NextResponse.json(
        { error: "保存咖啡豆失败，请稍后再试。" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/beans] Unexpected error:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}
