import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "arrow-down"
  | "arrow-right"
  | "book"
  | "cap"
  | "check"
  | "compass"
  | "credit-card"
  | "globe"
  | "mail"
  | "map-pin"
  | "menu"
  | "monitor"
  | "people"
  | "spark"
  | "support"
  | "x";

const paths: Record<IconName, ReactNode> = {
  "arrow-down": <path d="M12 5v14m-7-7 7 7 7-7" />,
  "arrow-right": <path d="M5 12h14m-7-7 7 7-7 7" />,
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
  check: <path d="m5 12 4 4L19 6" />,
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
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20m-10-10a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </>
  ),
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
