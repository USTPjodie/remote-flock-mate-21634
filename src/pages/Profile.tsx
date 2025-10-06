import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Settings, 
  Bell, 
  Download, 
  HelpCircle, 
  Shield,
  Smartphone,
  Wifi,
  Database
} from "lucide-react";

interface ProfileProps {
  user: { name: string; role: 'grower' | 'technician' };
  onLogout: () => void;
}

export const Profile = ({ user, onLogout }: ProfileProps) => {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
        <Badge variant={user.role === 'grower' ? "default" : "secondary"} className="mt-2">
          {user.role === 'grower' ? "Poultry Grower" : "Field Technician"}
        </Badge>
      </div>

      {/* Settings */}
      <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="notifications" className="text-sm font-medium">
                Push Notifications
              </Label>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="offline-mode" className="text-sm font-medium">
                Auto-Sync When Online
              </Label>
            </div>
            <Switch id="offline-mode" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="backup" className="text-sm font-medium">
                Daily Data Backup
              </Label>
            </div>
            <Switch id="backup" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">App Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Sync</span>
            <span className="font-medium text-success">2 minutes ago</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Data Storage</span>
            <span className="font-medium">2.3 MB</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start">
          <Download className="h-4 w-4 mr-2" />
          Export My Data
        </Button>
        
        <Button variant="outline" className="w-full justify-start">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help & Support
        </Button>
        
        <Button variant="outline" className="w-full justify-start">
          <Shield className="h-4 w-4 mr-2" />
          Privacy Policy
        </Button>
      </div>

      {/* Logout */}
      <Card className="shadow-soft bg-destructive/5 border-destructive/20">
        <CardContent className="p-4">
          <Button 
            variant="destructive" 
            onClick={onLogout}
            className="w-full"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};