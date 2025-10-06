import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoricalDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HistoricalDataModal = ({ open, onOpenChange }: HistoricalDataModalProps) => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Mock historical data
  const historicalData = [
    { date: '2024-01-15', mortality: 2.8, feedEfficiency: 1.82, weightGain: 0.31, totalFeed: 1950, trend: 'up' },
    { date: '2024-01-16', mortality: 3.1, feedEfficiency: 1.85, weightGain: 0.32, totalFeed: 2020, trend: 'up' },
    { date: '2024-01-17', mortality: 2.9, feedEfficiency: 1.83, weightGain: 0.30, totalFeed: 1980, trend: 'down' },
    { date: '2024-01-18', mortality: 3.3, feedEfficiency: 1.88, weightGain: 0.33, totalFeed: 2100, trend: 'up' },
    { date: '2024-01-19', mortality: 3.0, feedEfficiency: 1.84, weightGain: 0.31, totalFeed: 2010, trend: 'neutral' },
    { date: '2024-01-20', mortality: 3.2, feedEfficiency: 1.85, weightGain: 0.32, totalFeed: 2047, trend: 'up' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Historical Data</DialogTitle>
          <DialogDescription>
            View and analyze historical performance data across different time periods
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Range Selector */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-date">From Date</Label>
                  <Input
                    id="from-date"
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="to-date">To Date</Label>
                  <Input
                    id="to-date"
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button className="w-full mt-4" variant="secondary">
                <Calendar className="h-4 w-4 mr-2" />
                Apply Filter
              </Button>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground">Avg Mortality</p>
                <p className="text-lg font-bold text-foreground">3.05%</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-success/10 to-success/5">
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground">Feed Efficiency</p>
                <p className="text-lg font-bold text-foreground">1.845</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground">Weight Gain</p>
                <p className="text-lg font-bold text-foreground">0.315kg</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground">Total Feed</p>
                <p className="text-lg font-bold text-foreground">2018kg</p>
              </CardContent>
            </Card>
          </div>

          {/* Historical Data Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Mortality %</TableHead>
                  <TableHead>Feed Eff.</TableHead>
                  <TableHead>Weight Gain</TableHead>
                  <TableHead>Total Feed</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicalData.map((record) => (
                  <TableRow key={record.date}>
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell className={record.mortality > 3 ? "text-destructive" : "text-success"}>
                      {record.mortality}%
                    </TableCell>
                    <TableCell>{record.feedEfficiency}</TableCell>
                    <TableCell>{record.weightGain}kg</TableCell>
                    <TableCell>{record.totalFeed}kg</TableCell>
                    <TableCell>
                      {record.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : record.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      ) : (
                        <div className="h-4 w-4 bg-muted rounded-full" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
