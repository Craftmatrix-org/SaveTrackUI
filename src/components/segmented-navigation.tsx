import { Inbox, Settings, Receipt, CreditCard, TrendingUp, MessageCircle } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigationItems = [
  { 
    title: "Overview", 
    shortTitle: "Home",
    url: "/record", 
    icon: TrendingUp,
    badge: null
  },
  { 
    title: "Accounts", 
    shortTitle: "Accounts",
    url: "/account", 
    icon: CreditCard,
    badge: null
  },
  { 
    title: "Categories", 
    shortTitle: "Categories",
    url: "/category", 
    icon: Inbox,
    badge: null
  },
  { 
    title: "Bills", 
    shortTitle: "Bills",
    url: "/bills", 
    icon: Receipt,
    badge: "New"
  },
  { 
    title: "AI Chat", 
    shortTitle: "Chat",
    url: "/chat", 
    icon: MessageCircle,
    badge: "AI"
  },
  { 
    title: "Settings", 
    shortTitle: "Settings",
    url: "/settings", 
    icon: Settings,
    badge: null
  },
];

export function SegmentedNavigation() {
  const location = useLocation();
  const isMobile = useIsMobile();

  const baseClasses = cn(
    "fixed z-50 w-full transition-all duration-300 ease-in-out",
    "bg-gray-800 text-white shadow-lg",
    {
      // Desktop: top positioning
      "top-0 h-[60px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]": !isMobile,
      // Mobile: bottom positioning
      "bottom-0 h-[70px] shadow-[0_-2px_4px_rgba(0,0,0,0.1)]": isMobile,
    }
  );

  const containerClasses = cn(
    "h-full flex items-center justify-center px-4",
    "max-w-7xl mx-auto"
  );

  const segmentsContainerClasses = cn(
    "flex items-center justify-between w-full max-w-4xl",
    {
      "gap-1": isMobile,
      "gap-4": !isMobile,
    }
  );

  return (
    <nav className={baseClasses}>
      <div className={containerClasses}>
        <div className={segmentsContainerClasses}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            const IconComponent = item.icon;

            const segmentClasses = cn(
              "relative flex flex-col items-center justify-center transition-all duration-200",
              "hover:scale-105 hover:bg-white/10 rounded-lg cursor-pointer",
              {
                // Desktop styling
                "px-4 py-2 min-w-[80px]": !isMobile,
                // Mobile styling  
                "flex-1 py-2 px-1": isMobile,
                // Active state
                "bg-white/20": isActive,
              }
            );

            const textClasses = cn(
              "font-medium transition-colors duration-200",
              {
                "text-xs mt-1": isMobile,
                "text-sm": !isMobile,
                "text-white": isActive,
                "text-gray-300": !isActive,
              }
            );

            const iconClasses = cn(
              "transition-colors duration-200",
              {
                "w-5 h-5": isMobile,
                "w-4 h-4 mb-1": !isMobile,
                "text-white": isActive,
                "text-gray-400": !isActive,
              }
            );

            return (
              <Link
                key={item.url}
                to={item.url}
                className={segmentClasses}
              >
                <div className="relative flex flex-col items-center">
                  <IconComponent className={iconClasses} />
                  <span className={textClasses}>
                    {isMobile ? item.shortTitle : item.title}
                  </span>
                  
                  {/* Active indicator - underline for desktop, dot for mobile */}
                  {isActive && (
                    <div
                      className={cn(
                        "absolute transition-all duration-200",
                        {
                          // Desktop: bottom underline
                          "bottom-[-8px] left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white rounded-full": !isMobile,
                          // Mobile: top indicator dot
                          "top-[-4px] right-[-2px] w-2 h-2 bg-blue-400 rounded-full": isMobile,
                        }
                      )}
                    />
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <Badge 
                      variant={item.badge === 'AI' ? 'default' : 'secondary'} 
                      className={cn(
                        "absolute text-xs px-1.5 py-0.5 h-auto",
                        {
                          "top-[-4px] right-[-8px]": !isMobile,
                          "top-[-6px] right-[-6px] scale-75": isMobile,
                        }
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}