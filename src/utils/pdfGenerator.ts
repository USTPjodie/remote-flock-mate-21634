import jsPDF from 'jspdf';

interface ReportData {
  weeklyAverage: {
    mortality: number;
    feedEfficiency: number;
    weightGain: number;
    totalFeed: number;
  };
  performanceStatus: string;
  lastUpdated: string;
}

export const generatePDFReport = (reportData: ReportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(0, 102, 204);
  doc.text('PoultryWatch Performance Report', pageWidth / 2, 20, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });
  doc.text(`Last Updated: ${reportData.lastUpdated}`, pageWidth / 2, 33, { align: 'center' });
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 38, pageWidth - 20, 38);
  
  // Performance Status
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Overall Performance Status', 20, 50);
  
  doc.setFontSize(12);
  const statusColor: [number, number, number] = reportData.performanceStatus === 'good' 
    ? [34, 197, 94]  // green
    : reportData.performanceStatus === 'warning'
    ? [234, 179, 8]  // yellow
    : [239, 68, 68]; // red
  
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  const statusText = reportData.performanceStatus === 'good' 
    ? 'On Track'
    : reportData.performanceStatus === 'warning'
    ? 'Needs Attention'
    : 'Critical';
  doc.text(statusText, 20, 58);
  
  // Weekly Averages Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Weekly Average Metrics', 20, 75);
  
  doc.setFontSize(11);
  let yPos = 85;
  
  // Mortality
  doc.setTextColor(0, 0, 0);
  doc.text('Mortality Rate:', 25, yPos);
  doc.setTextColor(239, 68, 68);
  doc.text(`${reportData.weeklyAverage.mortality}%`, 120, yPos);
  yPos += 10;
  
  // Feed Efficiency
  doc.setTextColor(0, 0, 0);
  doc.text('Feed Efficiency (FCR):', 25, yPos);
  doc.setTextColor(34, 197, 94);
  doc.text(`${reportData.weeklyAverage.feedEfficiency}`, 120, yPos);
  yPos += 10;
  
  // Weight Gain
  doc.setTextColor(0, 0, 0);
  doc.text('Daily Weight Gain:', 25, yPos);
  doc.setTextColor(0, 102, 204);
  doc.text(`${reportData.weeklyAverage.weightGain} kg`, 120, yPos);
  yPos += 10;
  
  // Total Feed
  doc.setTextColor(0, 0, 0);
  doc.text('Total Feed Used:', 25, yPos);
  doc.setTextColor(0, 0, 0);
  doc.text(`${reportData.weeklyAverage.totalFeed} kg`, 120, yPos);
  yPos += 20;
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 15;
  
  // Performance Analysis
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Performance Analysis', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const analysisText = [
    'Based on the last 7 days of data:',
    '',
    '• Mortality rate is within acceptable range',
    '• Feed efficiency shows good conversion rates',
    '• Weight gain is progressing as expected',
    '• Overall flock health is stable',
    '',
    'Recommendations:',
    '• Continue current feeding schedule',
    '• Monitor environmental conditions closely',
    '• Maintain biosecurity protocols',
  ];
  
  analysisText.forEach(line => {
    doc.text(line, 25, yPos);
    yPos += 6;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('PoultryWatch - Cloud-based Poultry Monitoring System', pageWidth / 2, 280, { align: 'center' });
  doc.text('This report is auto-generated and intended for farm management purposes', pageWidth / 2, 285, { align: 'center' });
  
  // Save the PDF
  doc.save(`poultrywatch-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
