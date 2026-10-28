import type { Metadata } from "next";
import { AdminDashboard } from "@/components/portal/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard Demo | ALABATT-HUB CODL",
  description:
    "Explore the ALABATT-HUB admin portal demo with dashboards for students, instructors, courses, sessions, and payment activity.",
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
