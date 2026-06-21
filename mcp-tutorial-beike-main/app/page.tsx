import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <p className="text-lg font-medium">落地页</p>
      </div>
    </main>
  );
}
