import {
  DEMO_IDENTITY,
  DEMO_LOGIN_EMAIL,
  DEMO_LOGIN_PASSWORD,
} from "@/lib/portal/demo-data";
import { readDemoAccounts, writeDemoAccounts } from "@/lib/portal/storage";
import type { DemoAccount, StudentIdentity } from "@/lib/portal/types";

function passwordDigest(password: string, salt: string): Promise<ArrayBuffer> {
  const input = new TextEncoder().encode(`${salt}:${password}`);
  return window.crypto.subtle.digest("SHA-256", input);
}

function toHex(bytes: ArrayLike<number>): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function toIdentity(account: DemoAccount): StudentIdentity {
  return {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    studentId: account.studentId,
  };
}

export async function authenticateDemoAccount(
  emailInput: string,
  password: string,
): Promise<StudentIdentity | null> {
  const email = emailInput.trim().toLowerCase();

  if (
    (email === DEMO_LOGIN_EMAIL ||
      email === DEMO_IDENTITY.studentId.toLowerCase()) &&
    password === DEMO_LOGIN_PASSWORD
  ) {
    return DEMO_IDENTITY;
  }

  const account = readDemoAccounts().find(
    (savedAccount) =>
      savedAccount.email.toLowerCase() === email ||
      savedAccount.studentId.toLowerCase() === email,
  );
  if (!account?.passwordSalt || !account.passwordDigest) return null;

  const digest = toHex(
    new Uint8Array(await passwordDigest(password, account.passwordSalt)),
  );
  if (digest !== account.passwordDigest) return null;

  return toIdentity(account);
}

export async function createDemoAccount(input: {
  fullName: string;
  email: string;
  studentId: string;
  password: string;
}): Promise<StudentIdentity> {
  const email = input.email.trim().toLowerCase();
  const accounts = readDemoAccounts();
  if (
    email === DEMO_LOGIN_EMAIL ||
    accounts.some((account) => account.email.toLowerCase() === email)
  ) {
    throw new Error("An account already exists for that email address.");
  }

  const randomSalt = window.crypto.getRandomValues(new Uint8Array(16));
  const salt = toHex(randomSalt);
  const digest = toHex(
    new Uint8Array(await passwordDigest(input.password, salt)),
  );
  const account: DemoAccount = {
    id: window.crypto.randomUUID(),
    fullName: input.fullName.trim(),
    email,
    studentId: input.studentId.trim() || `DEMO-${Date.now().toString().slice(-8)}`,
    passwordSalt: salt,
    passwordDigest: digest,
    createdAt: new Date().toISOString(),
  };

  writeDemoAccounts([...accounts, account]);
  return toIdentity(account);
}
