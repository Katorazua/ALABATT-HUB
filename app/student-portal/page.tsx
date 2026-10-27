import type { Metadata } from "next";
import { AuthScreen } from "@/components/portal/auth-screen";

export const metadata: Metadata = {
  title: "Student Portal Demo | ALABATT-HUB CODL",
  description:
    "Sign in to the ALABATT-HUB Centre for Open and Distance Learning frontend demonstration.",
};

export default function StudentPortalPage() {
  return <AuthScreen />;
}
