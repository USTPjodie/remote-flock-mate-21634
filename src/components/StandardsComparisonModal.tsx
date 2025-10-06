import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, XCircle, TrendingUp } from "lucide-react";

interface StandardsComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StandardsComparisonModal = ({ open, onOpenChange }: StandardsComparisonModalProps) => {
  const comparisonData = [
    {
      metric: "Mortality Rate",
      current: 3.2,
      standard: 3.5,
      unit: "%",
      status: "good",
      description: "Below industry standard - excellent performance"
    },
    {
      metric: "Feed Conversion Ratio (FCR)",
      current: 1.85,
      standard: 1.75,
      unit: "",
      status: "warning",
      description: "Slightly above optimal - monitor feed quality"
    },
    {
      metric: "Daily Weight Gain",
      current: 0.32,
      standard: 0.30,
      unit: "kg",
      status: "good",
      description: "Above standard - birds growing well"
    },
    {
      metric: "Liveability Rate",
      current: 96.8,
      standard: 96.5,
      unit: "%",
      status: "good",
      description: "Meeting industry benchmarks"
    },
    {
      metric: "Feed Efficiency",
      current: 1.85,
      standard: 1.80,
      unit: "",
      status: "warning",
      description: "Room for improvement in feed management"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-success/10 text-success border-success">Above Standard</Badge>;
      case 'warning':
        return <Badge className="bg-warning/10 text-warning border-warning">Needs Improvement</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return null;
    }
  };

  const getPercentage = (current: number, standard: number) => {
    // For metrics where lower is better (mortality, FCR), invert the calculation
    const isLowerBetter = current < standard;
    if (isLowerBetter) {
      return Math.min(100, (standard / current) * 100);
    }
    return Math.min(100, (current / standard) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Standards Comparison</DialogTitle>
          <DialogDescription>
            Compare your farm's performance against industry standards and best practices
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Overall Performance Summary */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overall Performance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-foreground">87/100</span>
                  <Badge className="bg-success/10 text-success border-success">Good Performance</Badge>
                </div>
                <Progress value={87} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  You're performing above average compared to industry standards. Focus on feed efficiency for further improvement.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Individual Metrics Comparison */}
          <div className="space-y-3">
            {comparisonData.map((item, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <div>
                          <h4 className="font-semibold text-foreground">{item.metric}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-muted-foreground">Your Performance</p>
                        <p className="text-xl font-bold text-foreground">
                          {item.current}{item.unit}
                        </p>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                        <p className="text-muted-foreground">Industry Standard</p>
                        <p className="text-xl font-bold text-foreground">
                          {item.standard}{item.unit}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Performance vs Standard</span>
                        <span>{getPercentage(item.current, item.standard).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={getPercentage(item.current, item.standard)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span>Continue current mortality management practices - they're working well</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <span>Review feed formulation and storage conditions to improve FCR</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span>Maintain current environmental controls for optimal growth rates</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
