import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  Zap,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Easy Attendance",
    description: "Mark attendance with a single click. Check-in and check-out tracking with real-time validation.",
  },
  {
    icon: BarChart3,
    title: "Smart Reports",
    description: "Visual analytics and detailed reports with charts, trends, and exportable data.",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    description: "Natural language queries to understand your attendance patterns and get insights.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Admin controls for managing users, roles, and organization-wide attendance.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Role-based access control with encrypted data storage and audit trails.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Instant notifications and live updates for attendance status changes.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="container relative mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
                <ClipboardCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">AttendanceIQ</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>

        <div className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Smart Attendance Management{" "}
              <span className="text-primary">Powered by AI</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Streamline your attendance tracking with intelligent insights, 
              natural language queries, and beautiful reports. Built for modern teams.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Everything you need for attendance management
          </h2>
          <p className="text-muted-foreground">
            Powerful features designed to make tracking attendance effortless
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Ready to transform your attendance tracking?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of teams using AttendanceIQ to streamline their workflows
          </p>
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">AttendanceIQ</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AttendanceIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
