import { Inbox, Settings, Receipt, CreditCard, TrendingUp, MessageCircle } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { 
    title: "Overview", 
    url: "/record", 
    icon: TrendingUp,
    description: "Financial dashboard",
    badge: null
  },
  { 
    title: "Accounts", 
    url: "/account", 
    icon: CreditCard,
    description: "Bank accounts & wallets",
    badge: null
  },
  { 
    title: "Categories", 
    url: "/category", 
    icon: Inbox,
    description: "Expense categories",
    badge: null
  },
  { 
    title: "Bills", 
    url: "/bills", 
    icon: Receipt,
    description: "Recurring payments",
    badge: "New"
  },
  { 
    title: "AI Chat", 
    url: "/chat", 
    icon: MessageCircle,
    description: "Financial insights",
    badge: "AI"
  },
  { 
    title: "Settings", 
    url: "/settings", 
    icon: Settings,
    description: "App preferences",
    badge: null
  },
];

export function AppSidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <Sidebar 
      variant={isMobile ? "floating" : "sidebar"} 
      collapsible={isMobile ? "offcanvas" : "icon"}
      className={isMobile ? "border-r-0" : ""}
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold">SaveTrack</h2>
            <p className="text-xs text-muted-foreground">Personal Finance</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`relative ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">{item.title}</span>
                          {!isMobile && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.badge && (
                          <Badge 
                            variant={item.badge === 'AI' ? 'default' : 'secondary'} 
                            className="text-xs px-1.5 py-0.5 h-auto"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-muted-foreground text-center">
          <p>v2.0.0</p>
          <p className="mt-1">Craftmatrix.org</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
