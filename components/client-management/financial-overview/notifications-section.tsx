import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, DollarSign, FileText, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NotificationsSectionProps {
  userId: string;
}

export function NotificationsSection({ userId }: NotificationsSectionProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [reportAlerts, setReportAlerts] = useState(true);
  const [thresholdAmount, setThresholdAmount] = useState("1000");

  const notifications = [
    {
      id: 1,
      type: "payment",
      title: "Payment Due",
      message: "Payment of R$1,500 due from Client A in 3 days",
      date: "2024-03-15",
      status: "urgent"
    },
    {
      id: 2,
      type: "report",
      title: "Monthly Report",
      message: "February financial report is ready for review",
      date: "2024-03-10",
      status: "info"
    },
    {
      id: 3,
      type: "threshold",
      title: "Revenue Alert",
      message: "Monthly revenue exceeded threshold of R$10,000",
      date: "2024-03-08",
      status: "success"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payment Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded about upcoming payments
                </p>
              </div>
              <Switch
                checked={paymentReminders}
                onCheckedChange={setPaymentReminders}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Report Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications for new reports
                </p>
              </div>
              <Switch
                checked={reportAlerts}
                onCheckedChange={setReportAlerts}
              />
            </div>
            <div className="space-y-2">
              <Label>Revenue Threshold Alert</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={thresholdAmount}
                  onChange={(e) => setThresholdAmount(e.target.value)}
                  placeholder="Enter amount"
                />
                <Button variant="outline">Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-3 rounded-lg border"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    {notification.type === "payment" && (
                      <DollarSign className="h-4 w-4 text-primary" />
                    )}
                    {notification.type === "report" && (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                    {notification.type === "threshold" && (
                      <Bell className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <Badge
                        variant={
                          notification.status === "urgent"
                            ? "destructive"
                            : notification.status === "success"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {notification.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Notification Email</Label>
              <div className="flex gap-2">
                <Input type="email" placeholder="your@email.com" />
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Instant</Button>
                <Button variant="outline" className="flex-1">Daily Digest</Button>
                <Button variant="outline" className="flex-1">Weekly Summary</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}