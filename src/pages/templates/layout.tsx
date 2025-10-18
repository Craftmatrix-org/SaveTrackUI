import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        {/* Sticky header */}
        <div className="sticky top-2 z-50 bg-white">
          <Card className="w-full mt-2 shadow-sm p-4 flex flex-row">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Savetrack</h1>
          </Card>
        </div>

        {/* Scrollable main content */}
        <main>{children}</main>
      </div>
    </SidebarProvider>
  );
}
