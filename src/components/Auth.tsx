import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthProps {
  onLogin: (user: { name: string; role: 'grower' | 'technician' }) => void;
}

export const Auth = ({ onLogin }: AuthProps) => {
  const [isConnected] = useState(Math.random() > 0.3); // Simulate connectivity
  const [formData, setFormData] = useState({
    name: '',
    role: '' as 'grower' | 'technician' | ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    onLogin({
      name: formData.name,
      role: formData.role
    });

    toast({
      title: "Welcome to PoultryWatch!",
      description: `Logged in as ${formData.role}`
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-strong bg-gradient-to-br from-card to-muted/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-medium">
            <Sprout className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">PoultryWatch</CardTitle>
            <CardDescription className="text-muted-foreground">
              Cloud-based poultry monitoring system
            </CardDescription>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-success" />
                <span className="text-success font-medium">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-warning" />
                <span className="text-warning font-medium">Offline Mode</span>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value: 'grower' | 'technician') => 
                setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grower">Poultry Grower</SelectItem>
                  <SelectItem value="technician">Field Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent text-primary-foreground font-medium shadow-medium">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};