import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricsChart } from "@/components/MetricsChart";
import { Download, Calendar, TrendingUp, AlertCircle } from "lucide-react";

export const Reports = () => {
  const reportData = {
    weeklyAverage: {
      mortality: 3.2,
      feedEfficiency: 1.85,
      weightGain: 0.32,
      totalFeed: 2047
    },
    performanceStatus: 'good', // good, warning, alert
    lastUpdated: '2 hours ago'
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performance Reports</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {reportData.lastUpdated}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Avg Mortality</p>
                <p className="text-xl font-bold text-destructive">{reportData.weeklyAverage.mortality}</p>
              </div>
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Feed Efficiency</p>
                <p className="text-xl font-bold text-success">{reportData.weeklyAverage.feedEfficiency}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Weight Gain</p>
                <p className="text-xl font-bold text-accent">{reportData.weeklyAverage.weightGain}kg</p>
              </div>
              <Calendar className="h-6 w-6 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Feed Used</p>
                <p className="text-xl font-bold text-primary">{reportData.weeklyAverage.totalFeed}kg</p>
              </div>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Status */}
      <Card className={`shadow-soft ${
        reportData.performanceStatus === 'good' 
          ? 'bg-success/5 border-success/20' 
          : reportData.performanceStatus === 'warning'
          ? 'bg-warning/5 border-warning/20'
          : 'bg-destructive/5 border-destructive/20'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Overall Performance Status</h3>
              <p className="text-sm text-muted-foreground">
                Based on last 7 days of data analysis
              </p>
            </div>
            <Badge variant={
              reportData.performanceStatus === 'good' 
                ? 'default' 
                : reportData.performanceStatus === 'warning'
                ? 'secondary'
                : 'destructive'
            }>
              {reportData.performanceStatus === 'good' ? 'On Track' : 
               reportData.performanceStatus === 'warning' ? 'Needs Attention' : 'Critical'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance Chart */}
      <Card className="shadow-soft bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="text-foreground">Weekly Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricsChart />
        </CardContent>
      </Card>

      {/* Report Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start">
          <Calendar className="h-4 w-4 mr-2" />
          View Historical Data
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Download className="h-4 w-4 mr-2" />
          Download Detailed Report (PDF)
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <TrendingUp className="h-4 w-4 mr-2" />
          Compare with Standards
        </Button>
      </div>
    </div>
  );
};