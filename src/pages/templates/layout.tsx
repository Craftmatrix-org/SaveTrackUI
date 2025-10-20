import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 min-h-screen">
        {/* Mobile-optimized sticky header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Card className={`w-full shadow-sm border-b ${isMobile ? 'mx-2 mt-2 mb-0 rounded-b-none' : 'mt-2'} p-3 md:p-4 flex flex-row items-center justify-between`}>
            <div className="flex items-center gap-3">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-base md:text-lg font-semibold truncate">SaveTrack</h1>
            </div>
            {/* Mobile status indicator */}
            {isMobile && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            )}
          </Card>
        </div>

        {/* Responsive main content with proper mobile spacing */}
        <main className={`min-h-[calc(100vh-5rem)] ${isMobile ? 'px-2 pb-20' : 'px-4 pb-8'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile bottom navigation space */}
        {isMobile && <div className="h-16" />}
      </div>
    </SidebarProvider>
  );
}
