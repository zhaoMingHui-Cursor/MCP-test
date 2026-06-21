"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";

type Bean = {
  id: string;
  name: string;
  flavor_profile: string;
  origin: string;
  tags: string[] | null;
  image_url: string;
};

type LoadingState = "idle" | "loading" | "success" | "error";

export function BeansList() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<LoadingState>("idle");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBeans() {
      try {
        setState("loading");
        const response = await fetch("/api/beans", {
          signal: controller.signal,
        });

        const contentType = response.headers.get("content-type") ?? "";
        const isJson = contentType.includes("application/json");

        if (!response.ok || !isJson) {
          const fallbackMessage =
            "获取咖啡豆数据失败，请稍后再试。";

          if (isJson) {
            const body = (await response.json()) as { error?: string };
            throw new Error(body.error ?? fallbackMessage);
          }

          throw new Error(fallbackMessage);
        }

        const body = (await response.json()) as { data?: Bean[] };
        setBeans(body.data ?? []);
        setError(null);
        setState("success");
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("[BeansList] fetch error", err);
        setError(
          err instanceof Error
            ? err.message
            : "加载咖啡豆数据时出现问题，请稍后重试。",
        );
        setBeans([]);
        setState("error");
      }
    }

    void loadBeans();

    return () => controller.abort();
  }, []);

  const isLoading = state === "loading" || state === "idle";
  const isError = state === "error";
  const hasBeans = beans.length > 0;

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex animate-pulse flex-col gap-6 rounded-3xl border border-[#F0D7B7] bg-[#FFF9F1]/70 p-6 sm:flex-row"
            >
              <div className="h-48 w-full rounded-2xl bg-[#F3DCC0] sm:h-40 sm:w-40" />
              <div className="flex flex-1 flex-col gap-4">
                <div className="h-6 w-1/2 rounded bg-[#F0D7B7]" />
                <div className="h-4 w-full rounded bg-[#F0D7B7]" />
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 rounded-full bg-[#F0D7B7]" />
                  <div className="h-6 w-12 rounded-full bg-[#F0D7B7]" />
                  <div className="h-6 w-14 rounded-full bg-[#F0D7B7]" />
                </div>
                <div className="mt-auto h-10 w-32 rounded-2xl bg-[#F0D7B7]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="rounded-2xl border border-[#E8CFAF] bg-[#FFF2E0] px-6 py-10 text-center text-[#8A5A28] shadow-sm">
          {error ?? "加载咖啡豆数据时出现问题，请稍后重试。"}
        </div>
      );
    }

    if (!hasBeans) {
      return (
        <div className="rounded-2xl border border-dashed border-[#E5C99F] bg-[#FFF5E8] px-6 py-14 text-center text-[#8A5A28]">
          暂无咖啡豆数据
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {beans.map((bean) => (
          <article
            key={bean.id}
            className="group flex flex-col gap-6 overflow-hidden rounded-3xl border border-[#F0D7B7] bg-[#FFF9F1] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:flex-row"
          >
            <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-[#F3DCC0] sm:h-40 sm:w-40">
              <img
                src={bean.image_url}
                alt={`${bean.name} 咖啡豆`}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-[#5C3A12]">
                  {bean.name}
                </h2>
                <p className="text-sm leading-relaxed text-[#7C6040]">
                  {bean.flavor_profile}
                </p>
              </div>

              {bean.tags && bean.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {bean.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="rounded-full bg-[#F5DABD] px-3 py-1 text-xs font-medium text-[#6C451A] hover:bg-[#EAC9A4]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}

              <div className="mt-auto flex items-center gap-4 rounded-2xl bg-[#FDF3E3] px-4 py-3 text-sm text-[#7C5530]">
                <span className="font-medium text-[#A46A2E]">产地</span>
                <span className="font-semibold text-[#5C3A12]">
                  {bean.origin}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }, [beans, error, hasBeans, isError, isLoading]);

  return content;
}
