import type { Metadata } from "next";
import { AuthScreen } from "@/components/portal/auth-screen";

export const metadata: Metadata = {
  title: "Admin Portal Demo | ALABATT-HUB CODL",
  description:
    "Sign in to the ALABATT-HUB admin portal demo to explore role-based workflows and management tools.",
};

export default function AdminPortalPage() {
  return <AuthScreen />;
}
