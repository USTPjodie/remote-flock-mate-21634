import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataEntryProps {
  userRole: 'grower' | 'technician';
}

export const DataEntry = ({ userRole }: DataEntryProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mortality: '',
    feedConsumption: '',
    weight: '',
    notes: '',
    chicksLoaded: '',
    harvested: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate saving with offline capability
    toast({
      title: "Data Saved Successfully",
      description: "Data will sync when connection is available",
    });
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mortality: '',
      feedConsumption: '',
      weight: '',
      notes: '',
      chicksLoaded: '',
      harvested: ''
    });
  };

  const isGrowerRole = userRole === 'grower';

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {isGrowerRole ? "Daily Data Entry" : "Update Farm Records"}
        </h1>
        <Badge variant={isGrowerRole ? "default" : "secondary"}>
          {isGrowerRole ? "Grower" : "Technician"}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Data</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="notes">Notes & Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mortality">Mortality Count</Label>
                    <Input
                      id="mortality"
                      type="number"
                      placeholder="Number of deaths"
                      value={formData.mortality}
                      onChange={(e) => setFormData(prev => ({ ...prev, mortality: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="feedConsumption">Feed Consumption (kg)</Label>
                    <Input
                      id="feedConsumption"
                      type="number"
                      step="0.1"
                      placeholder="Total feed consumed"
                      value={formData.feedConsumption}
                      onChange={(e) => setFormData(prev => ({ ...prev, feedConsumption: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Average Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      placeholder="Sample average weight"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Production Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chicksLoaded">Day-Old Chicks Loaded</Label>
                    <Input
                      id="chicksLoaded"
                      type="number"
                      placeholder="Number of chicks"
                      value={formData.chicksLoaded}
                      onChange={(e) => setFormData(prev => ({ ...prev, chicksLoaded: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="harvested">Birds Harvested</Label>
                    <Input
                      id="harvested"
                      type="number"
                      placeholder="Number harvested"
                      value={formData.harvested}
                      onChange={(e) => setFormData(prev => ({ ...prev, harvested: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                {!isGrowerRole && (
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-accent" />
                      <Badge variant="outline">Technician Verification</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      As a field technician, you can verify and update grower-entered data.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notes & Observations</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any observations, health concerns, or special events..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Photo Documentation</Label>
                  <Button type="button" variant="outline" className="w-full mt-2">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo for Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent text-primary-foreground">
          <Save className="h-4 w-4 mr-2" />
          Save Data
        </Button>
      </form>
    </div>
  );
};