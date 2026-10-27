import type {
  DemoAccount,
  Payment,
  PortalSession,
  StudentData,
  StudentActivity,
  StudentNotification,
} from "@/lib/portal/types";

const ACCOUNTS_KEY = "alabatt-hub-demo-accounts-v1";
const SESSION_KEY = "alabatt-hub-demo-session-v1";
const STUDENT_DATA_PREFIX = "alabatt-hub-demo-student-v1:";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPayment(value: unknown): value is Payment {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.description === "string" &&
    typeof value.amount === "number" &&
    Number.isFinite(value.amount) &&
    typeof value.date === "string" &&
    typeof value.reference === "string" &&
    (value.status === "Pending" ||
      value.status === "Successful" ||
      value.status === "Failed")
  );
}

function isNotification(value: unknown): value is StudentNotification {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.message === "string" &&
    typeof value.category === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.read === "boolean"
  );
}

function isActivity(value: unknown): value is StudentActivity {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.createdAt === "string"
  );
}

function isStudentData(value: unknown): value is StudentData {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.profile)) {
    return false;
  }

  const profile = value.profile;
  const hasProfile = ["fullName", "email", "studentId", "phone", "address", "programme"]
    .every((field) => typeof profile[field] === "string");
  const hasArrays =
    Array.isArray(value.registeredCourseIds) &&
    value.registeredCourseIds.every((id) => typeof id === "string") &&
    Array.isArray(value.payments) &&
    value.payments.every(isPayment) &&
    Array.isArray(value.notifications) &&
    value.notifications.every(isNotification) &&
    Array.isArray(value.activities) &&
    value.activities.every(isActivity);

  return hasProfile && hasArrays;
}

function isDemoAccount(value: unknown): value is DemoAccount {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.fullName === "string" &&
    typeof value.email === "string" &&
    typeof value.studentId === "string" &&
    typeof value.createdAt === "string" &&
    (value.passwordSalt === undefined || typeof value.passwordSalt === "string") &&
    (value.passwordDigest === undefined ||
      typeof value.passwordDigest === "string")
  );
}

function isPortalSession(value: unknown): value is PortalSession {
  return (
    isRecord(value) &&
    typeof value.email === "string" &&
    typeof value.createdAt === "string"
  );
}

function readJson<T>(
  storage: Storage,
  key: string,
  isValue: (value: unknown) => value is T,
): T | null {
  const raw = storage.getItem(key);
  if (raw === null) return null;

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error(
      "Saved demo information could not be read. Clear the browser's demo data and try again.",
    );
  }

  if (!isValue(value)) {
    throw new Error(
      "Saved demo information has an unsupported format. Clear the browser's demo data and try again.",
    );
  }

  return value;
}

export function readDemoAccounts(): DemoAccount[] {
  const value = readJson(
    window.localStorage,
    ACCOUNTS_KEY,
    (input): input is DemoAccount[] =>
      Array.isArray(input) && input.every(isDemoAccount),
  );
  return value ?? [];
}

export function writeDemoAccounts(accounts: DemoAccount[]): void {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function readActiveSession(): PortalSession | null {
  const persistentSession = readJson(
    window.localStorage,
    SESSION_KEY,
    isPortalSession,
  );
  if (persistentSession) return persistentSession;

  return readJson(window.sessionStorage, SESSION_KEY, isPortalSession);
}

export function writeActiveSession(
  session: PortalSession,
  rememberMe: boolean,
): void {
  const targetStorage = rememberMe
    ? window.localStorage
    : window.sessionStorage;
  const otherStorage = rememberMe
    ? window.sessionStorage
    : window.localStorage;

  otherStorage.removeItem(SESSION_KEY);
  targetStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearActiveSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function studentDataKey(email: string): string {
  return `${STUDENT_DATA_PREFIX}${encodeURIComponent(email.toLowerCase())}`;
}

export function readStudentData(email: string): StudentData | null {
  return readJson(window.localStorage, studentDataKey(email), isStudentData);
}

export function writeStudentData(email: string, data: StudentData): void {
  window.localStorage.setItem(studentDataKey(email), JSON.stringify(data));
}

export function removeStudentData(email: string): void {
  window.localStorage.removeItem(studentDataKey(email));
}
