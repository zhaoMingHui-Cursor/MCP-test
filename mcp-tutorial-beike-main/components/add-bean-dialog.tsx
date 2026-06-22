"use client";

import { useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AddBeanDialogProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

type FormState = {
  name: string;
  flavorProfile: string;
  origin: string;
  tags: string;
  imageUrl: string;
};

const initialFormState: FormState = {
  name: "",
  flavorProfile: "",
  origin: "",
  tags: "",
  imageUrl: "",
};

const testFormState: FormState = {
  name: "耶加雪菲",
  flavorProfile: "明亮的柑橘酸质，伴随茉莉花香与蜂蜜甜感，余韵干净悠长。",
  origin: "埃塞俄比亚",
  tags: "花香, 柑橘, 水洗",
  imageUrl: "/bean_08.png",
};

function parseTags(raw: string): string[] {
  return raw
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function isFormComplete(form: FormState): boolean {
  return (
    form.name.trim().length > 0 &&
    form.flavorProfile.trim().length > 0 &&
    form.origin.trim().length > 0 &&
    form.imageUrl.trim().length > 0 &&
    parseTags(form.tags).length > 0
  );
}

export function AddBeanDialog({ onSuccess, onError }: AddBeanDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => isFormComplete(form), [form]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSubmitError(null);
  }

  function resetForm() {
    setForm(initialFormState);
    setSubmitError(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setForm(testFormState);
      setSubmitError(null);
    } else {
      resetForm();
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/beans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          flavor_profile: form.flavorProfile.trim(),
          origin: form.origin.trim(),
          tags: parseTags(form.tags),
          image_url: form.imageUrl.trim(),
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      const isJson = contentType.includes("application/json");
      const body = isJson
        ? ((await response.json()) as { error?: string })
        : null;

      if (!response.ok) {
        throw new Error(body?.error ?? "提交失败，请稍后再试。");
      }

      resetForm();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      onError?.();
      setSubmitError(
        error instanceof Error ? error.message : "提交失败，请稍后再试。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        aria-label="添加咖啡豆"
        onClick={() => handleOpenChange(true)}
        className="fixed bottom-8 right-8 z-40 h-14 w-14 rounded-full bg-[#B07A3B] text-white shadow-lg transition hover:bg-[#9A6932] hover:shadow-xl"
      >
        <PlusIcon className="size-6" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#F0D7B7] bg-[#FFF9F1] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#5C3A12]">添加咖啡豆</DialogTitle>
            <DialogDescription className="text-[#7C6040]">
              填写下方信息，分享你发现的精品咖啡豆。
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bean-name" className="text-[#5C3A12]">
                咖啡名称
              </Label>
              <Input
                id="bean-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="例如：耶加雪菲"
                className="border-[#E5C99F] bg-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bean-flavor" className="text-[#5C3A12]">
                口味描述
              </Label>
              <Textarea
                id="bean-flavor"
                value={form.flavorProfile}
                onChange={(event) =>
                  updateField("flavorProfile", event.target.value)
                }
                placeholder="描述香气、酸度、余韵等风味特点"
                className="min-h-24 border-[#E5C99F] bg-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bean-origin" className="text-[#5C3A12]">
                产地
              </Label>
              <Input
                id="bean-origin"
                value={form.origin}
                onChange={(event) => updateField("origin", event.target.value)}
                placeholder="例如：埃塞俄比亚"
                className="border-[#E5C99F] bg-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bean-tags" className="text-[#5C3A12]">
                标签
              </Label>
              <Input
                id="bean-tags"
                value={form.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="多个标签用逗号分隔，例如：花香, 柑橘, 水洗"
                className="border-[#E5C99F] bg-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bean-image-url" className="text-[#5C3A12]">
                图片链接
              </Label>
              <Input
                id="bean-image-url"
                type="text"
                value={form.imageUrl}
                onChange={(event) => updateField("imageUrl", event.target.value)}
                placeholder="例如：https://example.com/bean.jpg 或 /bean_08.png"
                className="border-[#E5C99F] bg-white"
              />
            </div>

            {submitError ? (
              <p className="text-sm text-red-600" role="alert">
                {submitError}
              </p>
            ) : null}

            <DialogFooter className="gap-[5px]">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="border-[#E5C99F] text-[#6C451A]"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="bg-[#B07A3B] text-white hover:bg-[#9A6932] disabled:opacity-50"
              >
                {isSubmitting ? "提交中..." : "提交"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
