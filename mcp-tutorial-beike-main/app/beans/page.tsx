import { Navbar } from "@/components/navbar";
import { BeansList } from "@/components/beans-list";

export default function BeansPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 bg-[#FFF7EE] py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
          <header className="flex flex-col items-center gap-4 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-[#B07A3B]">
              精品咖啡豆精选
            </span>
            <h1 className="text-3xl font-semibold text-[#5C3A12] sm:text-4xl">
              为你挑选每一颗香气四溢的咖啡豆
            </h1>
            <p className="max-w-2xl text-base text-[#6D5335] sm:text-lg">
              探索来自世界各地的特色风味。挑选喜欢的口感、产地与标签，开启属于你的杯中旅程。
            </p>
          </header>

          <BeansList />
        </div>
      </section>
    </main>
  );
}
