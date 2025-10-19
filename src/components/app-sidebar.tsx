import { Calendar, Home, Inbox, Search, Settings, Receipt } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "records", url: "/record", icon: Home },
  { title: "category", url: "/category", icon: Inbox },
  { title: "account", url: "/account", icon: Calendar },
  { title: "bills", url: "/bills", icon: Receipt },
  { title: "chat", url: "/chat", icon: Search },
  { title: "settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation(); // get current path

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="capitalize">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
