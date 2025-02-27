import { TopBar } from "../components/TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col">
      <TopBar />
      <div className=" w-full h-screen p-2">{children}</div>
    </main>
  );
}
