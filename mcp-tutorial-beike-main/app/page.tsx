import { ContactDialog } from "@/components/contact-dialog";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <p className="text-lg font-medium">落地页</p>
        <ContactDialog />
      </div>
    </main>
  );
}
