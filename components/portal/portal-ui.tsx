import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";

export function PortalBrand({ light = false }: { light?: boolean }) {
  return (
    <Link
      aria-label="ALABATT-HUB, back to home"
      className={`portal-brand${light ? " portal-brand-light" : ""}`}
      href="/"
    >
      <span className="portal-brand-mark"><Icon name="cap" /></span>
      <span>
        <strong>ALABATT-HUB</strong>
        <small>Centre for Open and Distance Learning</small>
      </span>
    </Link>
  );
}

export function PortalMessage({
  children,
  kind = "info",
}: {
  children: ReactNode;
  kind?: "error" | "success" | "info";
}) {
  return (
    <div
      className={`portal-message portal-message-${kind}`}
      role={kind === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}

export function PrototypeBadge({ children = "DEMO DATA" }: { children?: ReactNode }) {
  return <span className="prototype-badge">{children}</span>;
}
