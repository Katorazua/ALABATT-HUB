import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "arrow-down"
  | "arrow-right"
  | "arrow-up-right"
  | "book"
  | "cap"
  | "calendar"
  | "check"
  | "clock"
  | "compass"
  | "credit-card"
  | "dashboard"
  | "edit"
  | "file"
  | "globe"
  | "grades"
  | "info"
  | "logout"
  | "mail"
  | "map-pin"
  | "menu"
  | "monitor"
  | "notification"
  | "people"
  | "profile"
  | "receipt"
  | "search"
  | "settings"
  | "spark"
  | "support"
  | "trash"
  | "wallet"
  | "x";

const paths: Record<IconName, ReactNode> = {
  "arrow-down": <path d="M12 5v14m-7-7 7 7 7-7" />,
  "arrow-right": <path d="M5 12h14m-7-7 7 7-7 7" />,
  "arrow-up-right": <path d="M7 17 17 7M7 7h10v10" />,
  book: (
    <>
      <path d="M12 7v14" />
      <path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-4a3 3 0 0 0-3 3 3 3 0 0 0-3-3H5a2 2 0 0 1-2-2Z" />
    </>
  ),
  cap: (
    <>
      <path d="m2 10 10-5 10 5-10 5-10-5Z" />
      <path d="M6 12v5c3.5 2.7 8.5 2.7 12 0v-5m4-2v6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1Z" />
    </>
  ),
  "credit-card": (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20m-16 5h4" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </>
  ),
  edit: (
    <>
      <path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8m-8 4h8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20m-10-10a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </>
  ),
  grades: (
    <>
      <path d="M4 20V10m5 10V4m6 16v-7m5 7V7" />
      <path d="M2 20h20" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 11v5m0-8h.01" />
    </>
  ),
  logout: <path d="M10 17l5-5-5-5m5 5H3m9-9h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8m-4-4v4" />
    </>
  ),
  people: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm12 10v-2a4 4 0 0 0-3-3.9m-1-12.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  notification: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </>
  ),
  receipt: (
    <>
      <path d="M4 3h16v18l-4-2-4 2-4-2-4 2V3Z" />
      <path d="M8 8h8m-8 4h8m-8 4h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8.6 8.6 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8.6 8.6 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7.5 7.5 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8.6 8.6 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8.6 8.6 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7.5 7.5 0 0 1 0 2Z" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
      <path d="m19 14 1 2.5 2.5 1-2.5 1L19 21l-1-2.5-2.5-1 2.5-1 1-2.5ZM5 2l1 2.5L8.5 5.5 6 6.5 5 9 4 6.5 1.5 5.5 4 4.5 5 2Z" />
    </>
  ),
  support: (
    <>
      <path d="M3 14v-3a9 9 0 0 1 18 0v3m-18 0v3a2 2 0 0 0 2 2h2v-7H5a2 2 0 0 0-2 2Zm18 0v3a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-5 4v6m4-6v6" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6a3 3 0 0 1-3-3V6.5" />
      <path d="M3 7h17m-4 6h4m-4 0a1 1 0 1 0 0 .1" />
    </>
  ),
  x: <path d="m18 6-12 12M6 6l12 12" />,
};

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
