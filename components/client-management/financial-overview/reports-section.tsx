import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileSpreadsheet, FileText, PieChart, TrendingUp } from "lucide-react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

interface ReportsSectionProps {
  userId: string;
}

export function ReportsSection({ userId }: ReportsSectionProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedReport, setSelectedReport] = useState("revenue");

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    console.log("Generate report", {
      type: selectedReport,
      dateRange,
      client: selectedClient,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={(newDate) => setDateRange(newDate || { 
              from: addDays(new Date(), -30),
              to: new Date()
            })}
          />
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {/* Add client options dynamically */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => setSelectedReport("revenue")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Revenue Report</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed revenue analysis and trends
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedReport("profitability")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Profitability Report</h3>
                <p className="text-sm text-muted-foreground">
                  Profit margins and cost analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedReport("tax")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Tax Report</h3>
                <p className="text-sm text-muted-foreground">
                  Tax summary and documentation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleGenerateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate PDF Report
            </Button>
            <Button variant="outline" onClick={handleGenerateReport}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Generate Excel Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}