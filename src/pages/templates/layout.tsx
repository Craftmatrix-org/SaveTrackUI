import { SegmentedNavigation } from "@/components/segmented-navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex-1 min-h-screen">
      {/* Segmented Navigation */}
      <SegmentedNavigation />
      
      {/* Responsive main content with proper spacing for nav bars */}
      <main className={`min-h-screen ${
        isMobile 
          ? 'pt-4 pb-20 px-2' // Mobile: space for bottom nav
          : 'pt-20 pb-8 px-4'  // Desktop: space for top nav
      }`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
