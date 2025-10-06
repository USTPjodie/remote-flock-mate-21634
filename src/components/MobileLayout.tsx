import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Wifi, WifiOff } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  user: { name: string; role: 'grower' | 'technician' };
  onLogout: () => void;
  showBottomNav?: boolean;
}

export const MobileLayout = ({ children, user, onLogout, showBottomNav = true }: MobileLayoutProps) => {
  const isConnected = Math.random() > 0.3; // Simulate connectivity

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-soft sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">{user.name}</h1>
              <Badge variant={user.role === 'grower' ? "default" : "secondary"} className="text-xs">
                {user.role === 'grower' ? "Grower" : "Technician"}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-success" />
              ) : (
                <WifiOff className="h-4 w-4 text-warning" />
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("pb-20", !showBottomNav && "pb-4")}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};