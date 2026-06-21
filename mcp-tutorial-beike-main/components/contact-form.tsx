"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  name: z.string().min(2, "姓名至少需要 2 个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  message: z.string().min(10, "留言至少需要 10 个字符"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type ContactFormProps = {
  className?: string;
  onSuccess?: () => void;
};

export function ContactForm({ className, onSuccess }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.info("[ContactForm] submitted", data);
    reset();
    onSuccess?.();
  });

  if (isSubmitSuccessful) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        感谢您的留言，我们会尽快与您联系。
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="contact-name">姓名</Label>
        <Input
          id="contact-name"
          placeholder="请输入您的姓名"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-email">邮箱</Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="name@example.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-message">留言</Label>
        <Textarea
          id="contact-message"
          placeholder="请描述您的问题或建议"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "提交中..." : "提交留言"}
      </Button>
    </form>
  );
}
