import type { Metadata } from "next";
import { AuthScreen } from "@/components/portal/auth-screen";

export const metadata: Metadata = {
  title: "Instructor Portal Demo | ALABATT-HUB CODL",
  description:
    "Sign in to the ALABATT-HUB instructor portal demo to explore teaching and session workflows.",
};

export default function InstructorPortalPage() {
  return <AuthScreen />;
}
