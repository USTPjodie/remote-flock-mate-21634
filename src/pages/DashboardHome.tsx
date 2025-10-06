import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Activity, 
  Users,
  AlertCircle
} from "lucide-react";
import { EnvironmentalMonitor } from "@/components/EnvironmentalMonitor";

export const DashboardHome = () => {
  const [metrics] = useState({
    totalChicks: 5240,
    mortality: 23,
    feedConsumption: 1847,
    avgWeight: 2.3,
    temperature: 28.5,
    humidity: 65,
    alerts: 2
  });

  return (
    <div className="p-4 space-y-6">
      {/* Alert Banner */}
      {metrics.alerts > 0 && (
        <Card className="border-warning bg-warning/5 animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning animate-gentle-pulse" />
              <div>
                <p className="font-medium text-warning-foreground">
                  {metrics.alerts} Alert{metrics.alerts > 1 ? 's' : ''} Require Attention
                </p>
                <p className="text-sm text-muted-foreground">
                  High humidity detected in Barn 2
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Chicks</p>
                <p className="text-2xl font-bold text-foreground">{metrics.totalChicks.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mortality</p>
                <p className="text-2xl font-bold text-destructive">{metrics.mortality}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Feed (kg)</p>
                <p className="text-2xl font-bold text-foreground">{metrics.feedConsumption.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Weight</p>
                <p className="text-2xl font-bold text-foreground">{metrics.avgWeight}kg</p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Monitoring */}
      <EnvironmentalMonitor 
        temperature={metrics.temperature}
        humidity={metrics.humidity}
      />
    </div>
  );
};