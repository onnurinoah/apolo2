import Header from "@/components/layout/Header";
import TabBar from "@/components/layout/TabBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20">{children}</main>
      <TabBar />
    </div>
  );
}
