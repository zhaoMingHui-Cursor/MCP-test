import Link from "next/link";

import { AuthButton } from "@/components/auth-button";

export async function Navbar() {
  return (
    <header className="w-full flex justify-center py-6">
      <div className="flex w-full max-w-5xl items-center justify-between px-6">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/">首页</Link>
          <Link href="/beans">咖啡豆</Link>
        </nav>
        <AuthButton />
      </div>
    </header>
  );
}
