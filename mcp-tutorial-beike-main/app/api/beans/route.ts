import { NextResponse } from "next/server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

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
