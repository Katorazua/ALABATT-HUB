import type { Metadata } from "next";
import { InstructorDashboard } from "@/components/portal/instructor-dashboard";

export const metadata: Metadata = {
  title: "Instructor Dashboard Demo | ALABATT-HUB CODL",
  description:
    "Explore the ALABATT-HUB instructor portal demo with course and session summaries.",
};

export default function InstructorDashboardPage() {
  return <InstructorDashboard />;
}
