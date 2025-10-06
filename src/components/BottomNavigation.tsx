import { NavLink, useLocation } from "react-router-dom";
import { Home, Plus, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    to: "/dashboard",
    icon: Home,
    label: "Home"
  },
  {
    to: "/data-entry",
    icon: Plus,
    label: "Add Data"
  },
  {
    to: "/reports",
    icon: BarChart3,
    label: "Reports"
  },
  {
    to: "/profile",
    icon: User,
    label: "Profile"
  }
];

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t shadow-strong z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg min-w-[60px] transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mb-1",
                isActive && "text-primary"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive && "text-primary"
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};