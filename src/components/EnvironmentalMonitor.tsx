import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Droplets, AlertTriangle, CheckCircle } from "lucide-react";

interface EnvironmentalMonitorProps {
  temperature: number;
  humidity: number;
}

export const EnvironmentalMonitor = ({ temperature, humidity }: EnvironmentalMonitorProps) => {
  // Optimal ranges for poultry
  const tempOptimal = temperature >= 20 && temperature <= 30;
  const humidityOptimal = humidity >= 50 && humidity <= 70;

  const getTempStatus = () => {
    if (temperature < 20) return { status: 'Too Cold', color: 'text-destructive', icon: AlertTriangle };
    if (temperature > 30) return { status: 'Too Hot', color: 'text-destructive', icon: AlertTriangle };
    return { status: 'Optimal', color: 'text-success', icon: CheckCircle };
  };

  const getHumidityStatus = () => {
    if (humidity < 50) return { status: 'Too Dry', color: 'text-warning', icon: AlertTriangle };
    if (humidity > 70) return { status: 'Too Humid', color: 'text-destructive', icon: AlertTriangle };
    return { status: 'Optimal', color: 'text-success', icon: CheckCircle };
  };

  const tempStatus = getTempStatus();
  const humidityStatus = getHumidityStatus();

  return (
    <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          Environmental Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temperature Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Temperature</span>
            </div>
            <div className="flex items-center gap-2">
              <tempStatus.icon className={`h-4 w-4 ${tempStatus.color}`} />
              <Badge variant={tempOptimal ? "default" : "destructive"} className="text-xs">
                {tempStatus.status}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current: {temperature}°C</span>
              <span className="text-muted-foreground">Range: 20-30°C</span>
            </div>
            <Progress 
              value={Math.min(Math.max((temperature / 40) * 100, 0), 100)} 
              className="h-2"
            />
          </div>
        </div>

        {/* Humidity Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-accent" />
              <span className="font-medium text-foreground">Humidity</span>
            </div>
            <div className="flex items-center gap-2">
              <humidityStatus.icon className={`h-4 w-4 ${humidityStatus.color}`} />
              <Badge variant={humidityOptimal ? "default" : "destructive"} className="text-xs">
                {humidityStatus.status}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current: {humidity}%</span>
              <span className="text-muted-foreground">Range: 50-70%</span>
            </div>
            <Progress 
              value={humidity} 
              className="h-2"
            />
          </div>
        </div>

        {/* Recommendations */}
        {(!tempOptimal || !humidityOptimal) && (
          <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
            <p className="text-sm font-medium text-warning-foreground mb-1">
              Action Required
            </p>
            <p className="text-xs text-muted-foreground">
              {!tempOptimal && !humidityOptimal 
                ? "Adjust both temperature and humidity levels"
                : !tempOptimal 
                ? "Temperature is outside optimal range"
                : "Humidity levels need adjustment"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};