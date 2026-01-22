import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  LogIn,
  LogOut,
  Clock,
  Calendar,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

interface TodayAttendance {
  id: string;
  date: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
  notes: string | null;
}

export default function Attendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("date", today)
        .maybeSingle();

      if (!error && data) {
        setTodayAttendance(data as TodayAttendance);
        setNotes(data.notes || "");
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const now = new Date();
      const today = format(now, "yyyy-MM-dd");
      const checkInTime = now.toISOString();
      
      // Determine status based on check-in time (9 AM cutoff)
      const hour = now.getHours();
      const status = hour >= 9 ? "late" : "present";

      const { data, error } = await supabase
        .from("attendance")
        .insert({
          user_id: user.id,
          date: today,
          check_in: checkInTime,
          status,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      setTodayAttendance(data as TodayAttendance);
      toast({
        title: "Check-in successful!",
        description: `You checked in at ${format(now, "h:mm a")}${status === "late" ? " (Late)" : ""}`,
      });
    } catch (error: any) {
      toast({
        title: "Check-in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance) return;
    setIsSubmitting(true);

    try {
      const now = new Date();
      const checkOutTime = now.toISOString();

      const { data, error } = await supabase
        .from("attendance")
        .update({
          check_out: checkOutTime,
          notes: notes || null,
        })
        .eq("id", todayAttendance.id)
        .select()
        .single();

      if (error) throw error;

      setTodayAttendance(data as TodayAttendance);
      toast({
        title: "Check-out successful!",
        description: `You checked out at ${format(now, "h:mm a")}`,
      });
    } catch (error: any) {
      toast({
        title: "Check-out failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-success/10 text-success border-success/20";
      case "late":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const calculateWorkHours = () => {
    if (!todayAttendance?.check_in || !todayAttendance?.check_out) return null;
    const checkIn = new Date(todayAttendance.check_in);
    const checkOut = new Date(todayAttendance.check_out);
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
          <p className="text-muted-foreground">
            Record your attendance for {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        {/* Current Time */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div className="text-4xl font-bold text-foreground">
                {format(new Date(), "h:mm a")}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Attendance
            </CardTitle>
            <CardDescription>
              {todayAttendance
                ? "Your attendance has been recorded for today"
                : "You haven't marked attendance yet"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {todayAttendance && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <Badge className={getStatusColor(todayAttendance.status)}>
                    {todayAttendance.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  {calculateWorkHours() && (
                    <span className="text-sm text-muted-foreground">
                      Total: {calculateWorkHours()}
                    </span>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                      <LogIn className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Check-in</p>
                      <p className="font-medium">
                        {todayAttendance.check_in
                          ? format(new Date(todayAttendance.check_in), "h:mm a")
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                      <LogOut className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Check-out</p>
                      <p className="font-medium">
                        {todayAttendance.check_out
                          ? format(new Date(todayAttendance.check_out), "h:mm a")
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes (optional)</label>
              <Textarea
                placeholder="Add any notes about your attendance..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!todayAttendance ? (
                <Button
                  onClick={handleCheckIn}
                  disabled={isSubmitting}
                  className="flex-1"
                  size="lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  Check In
                </Button>
              ) : !todayAttendance.check_out ? (
                <Button
                  onClick={handleCheckOut}
                  disabled={isSubmitting}
                  variant="secondary"
                  className="flex-1"
                  size="lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Check Out
                </Button>
              ) : (
                <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-success/20 bg-success/10 py-3 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Attendance Complete</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
