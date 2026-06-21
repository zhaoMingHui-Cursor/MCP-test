"use client";

import type { ComponentProps, ReactNode } from "react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type DropdownMenuItemProps = ComponentProps<typeof DropdownMenuItem>;

type LogoutButtonProps = Omit<DropdownMenuItemProps, "onSelect"> & {
  children?: ReactNode;
};

export function LogoutButton({
  children = "退出登录",
  className,
  ...props
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }, [router]);

  return (
    <DropdownMenuItem
      className={cn("cursor-pointer", className)}
      onSelect={() => {
        void handleLogout();
      }}
      {...props}
    >
      {children}
    </DropdownMenuItem>
  );
}
