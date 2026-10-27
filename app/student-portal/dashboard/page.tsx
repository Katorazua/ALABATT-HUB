import type { Metadata } from "next";
import { DashboardShell } from "@/components/portal/dashboard-shell";

export const metadata: Metadata = {
  title: "Student Dashboard Demo | ALABATT-HUB CODL",
  description:
    "Explore sample academic information and student services in the ALABATT-HUB CODL frontend demonstration.",
};

export default function StudentDashboardPage() {
  return <DashboardShell />;
}
