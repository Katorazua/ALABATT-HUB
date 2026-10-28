"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { PortalBrand, PortalMessage } from "@/components/portal/portal-ui";
import {
  authenticateDemoAccount,
  createDemoAccount,
} from "@/lib/portal/auth-service";
import {
  ADMIN_LOGIN_EMAIL,
  ADMIN_LOGIN_PASSWORD,
  DEMO_LOGIN_EMAIL,
  DEMO_LOGIN_PASSWORD,
  INSTRUCTOR_LOGIN_EMAIL,
  INSTRUCTOR_LOGIN_PASSWORD,
} from "@/lib/portal/demo-data";
import { readActiveSession, writeActiveSession } from "@/lib/portal/storage";
import type { StudentIdentity } from "@/lib/portal/types";

type AuthMode = "login" | "register";

export function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<"student" | "admin" | "instructor">("student");
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"error" | "success" | "info">("info");
  const [pendingIdentity, setPendingIdentity] = useState<StudentIdentity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function checkSession() {
      await Promise.resolve();
      try {
        const session = readActiveSession();
        if (!session) return;

        const targetRoute =
          session.role === "admin"
            ? "/admin-portal/dashboard"
            : session.role === "instructor"
              ? "/instructor-portal/dashboard"
              : "/student-portal/dashboard";
        router.replace(targetRoute);
      } catch (error) {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : "Could not read the demo session.");
        setMessageKind("error");
      }
    }

    void checkSession();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const identity = await authenticateDemoAccount(email, password);
      if (!identity) {
        setMessage("Those demo credentials were not recognised. Check the email and password and try again.");
        setMessageKind("error");
        return;
      }

      writeActiveSession(
        {
          email: identity.email,
          createdAt: new Date().toISOString(),
          role: identity.role ?? "student",
        },
        rememberMe,
      );
      router.push(
        identity.role === "admin"
          ? "/admin-portal/dashboard"
          : identity.role === "instructor"
            ? "/instructor-portal/dashboard"
            : "/student-portal/dashboard",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Demo sign-in could not be completed.");
      setMessageKind("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Choose a password with at least 8 characters.");
      setMessageKind("error");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      setMessageKind("error");
      return;
    }

    setIsSubmitting(true);
    try {
      const identity = await createDemoAccount({
        fullName,
        email,
        studentId,
        password,
      });
      setPendingIdentity(identity);
      setPassword("");
      setConfirmPassword("");
      setMessage("Your local demo account is ready. This is not official university enrolment.");
      setMessageKind("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The demo account could not be created.");
      setMessageKind("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function continueToDashboard() {
    if (!pendingIdentity) return;
    try {
      writeActiveSession(
        {
          email: pendingIdentity.email,
          createdAt: new Date().toISOString(),
          role: pendingIdentity.role ?? "student",
        },
        rememberMe,
      );
      router.push(
        pendingIdentity.role === "admin"
          ? "/admin-portal/dashboard"
          : pendingIdentity.role === "instructor"
            ? "/instructor-portal/dashboard"
            : "/student-portal/dashboard",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The demo session could not be started.");
      setMessageKind("error");
    }
  }

  function showPasswordRecoveryNotice() {
    setMessage("Password recovery is a prototype placeholder. No email will be sent.");
    setMessageKind("info");
  }

  function applyDemoCredentials(role: "student" | "admin" | "instructor") {
    setSelectedDemoRole(role);
    if (role === "admin") {
      setEmail(ADMIN_LOGIN_EMAIL);
      setPassword(ADMIN_LOGIN_PASSWORD);
      setMessage("Admin demo credentials applied. You can sign in or modify the form as needed.");
      setMessageKind("info");
      return;
    }
    if (role === "instructor") {
      setEmail(INSTRUCTOR_LOGIN_EMAIL);
      setPassword(INSTRUCTOR_LOGIN_PASSWORD);
      setMessage("Instructor demo credentials applied. You can sign in or modify the form as needed.");
      setMessageKind("info");
      return;
    }

    setEmail(DEMO_LOGIN_EMAIL);
    setPassword(DEMO_LOGIN_PASSWORD);
    setMessage("Student demo credentials applied. You can sign in or modify the form as needed.");
    setMessageKind("info");
  }

  return (
    <main className="portal-auth-page">
      <div className="auth-topbar">
        <PortalBrand />
        <Link className="auth-home-link" href="/">
          <Icon name="arrow-right" /> Back to website
        </Link>
      </div>

      <div className="auth-layout">
        <section aria-labelledby="auth-intro-title" className="auth-welcome-panel">
          <span className="auth-panel-kicker">CODL STUDENT SERVICES</span>
          <h1 id="auth-intro-title">A connected place for your learning journey.</h1>
          <p>
            Explore a frontend demonstration of how ALABATT-HUB may bring
            student information and academic services together.
          </p>
          <div className="auth-feature-list">
            <div><Icon name="check" /><span>Academic information in one place</span></div>
            <div><Icon name="check" /><span>Simple, student-focused navigation</span></div>
            <div><Icon name="check" /><span>Designed for open and distance learning</span></div>
          </div>
          <div className="auth-campus-note">
            <Icon name="map-pin" />
            <span>Rev. Fr. Moses Orshio Adasu University<br />Makurdi, Benue State, Nigeria</span>
          </div>
          <span aria-hidden="true" className="auth-watermark"><Icon name="cap" /></span>
        </section>

        <section aria-labelledby="auth-title" className="auth-card">
          <div className="auth-card-heading">
            <span className="eyebrow">STUDENT, ADMIN & INSTRUCTOR PORTAL</span>
            <h2 id="auth-title">{mode === "login" ? "Welcome back" : "Create a demo account"}</h2>
            <p>
              {mode === "login"
                ? "Sign in with a student or admin demo account to explore the prototype."
                : "Set up a local account to explore the prototype."}
            </p>
          </div>

          <div aria-label="Choose an authentication option" className="auth-tabs">
            <button
              aria-pressed={mode === "login"}
              className={mode === "login" ? "is-selected" : ""}
              onClick={() => {
                setMode("login");
                setMessage("");
                setPendingIdentity(null);
              }}
              type="button"
            >
              Login
            </button>
            <button
              aria-pressed={mode === "register"}
              className={mode === "register" ? "is-selected" : ""}
              onClick={() => {
                setMode("register");
                setMessage("");
                setPendingIdentity(null);
              }}
              type="button"
            >
              Create Account
            </button>
          </div>

          {message && <PortalMessage kind={messageKind}>{message}</PortalMessage>}

          {mode === "login" ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <label htmlFor="login-email">Email address or student ID</label>
              <input
                autoComplete="username"
                id="login-email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email or student ID"
                required
                type="text"
                value={email}
              />
              <div className="password-label-row">
                <label htmlFor="login-password">Password</label>
                <button className="subtle-link" onClick={showPasswordRecoveryNotice} type="button">
                  Forgot password?
                </button>
              </div>
              <div className="password-input-wrap">
                <input
                  autoComplete="current-password"
                  id="login-password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <label className="remember-option">
                <input
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  type="checkbox"
                />
                <span>Remember me on this device</span>
              </label>
              <button className="button button-primary auth-submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Signing in..." : "Sign in"}
                <Icon name="arrow-right" />
              </button>
              <div className="auth-divider"><span>DEMO ACCESS</span></div>
              <div className="demo-role-picker">
                <button
                  className={selectedDemoRole === "student" ? "demo-role-button is-selected" : "demo-role-button"}
                  onClick={() => applyDemoCredentials("student")}
                  type="button"
                >
                  Student Demo Login
                </button>
                <button
                  className={selectedDemoRole === "admin" ? "demo-role-button is-selected" : "demo-role-button"}
                  onClick={() => applyDemoCredentials("admin")}
                  type="button"
                >
                  Admin Demo Login
                </button>
                <button
                  className={selectedDemoRole === "instructor" ? "demo-role-button is-selected" : "demo-role-button"}
                  onClick={() => applyDemoCredentials("instructor")}
                  type="button"
                >
                  Instructor Demo Login
                </button>
              </div>
              <div className="demo-credentials">
                <div>
                  <span>Email</span>
                  <code>
                    {selectedDemoRole === "admin"
                      ? ADMIN_LOGIN_EMAIL
                      : selectedDemoRole === "instructor"
                        ? INSTRUCTOR_LOGIN_EMAIL
                        : DEMO_LOGIN_EMAIL}
                  </code>
                </div>
                <div>
                  <span>Password</span>
                  <code>
                    {selectedDemoRole === "admin"
                      ? ADMIN_LOGIN_PASSWORD
                      : selectedDemoRole === "instructor"
                        ? INSTRUCTOR_LOGIN_PASSWORD
                        : DEMO_LOGIN_PASSWORD}
                  </code>
                </div>
                <button
                  className="demo-fill-button"
                  onClick={() => applyDemoCredentials(selectedDemoRole)}
                  type="button"
                >
                  Use selected demo credentials
                </button>
              </div>
            </form>
          ) : pendingIdentity ? (
            <div className="registration-complete">
              <span className="success-icon"><Icon name="check" /></span>
              <h3>Demo account created</h3>
              <p>
                {pendingIdentity.email} is ready for this browser. No official
                university enrolment has taken place.
              </p>
              <button className="button button-primary auth-submit" onClick={continueToDashboard} type="button">
                Continue to demo dashboard <Icon name="arrow-right" />
              </button>
            </div>
          ) : (
            <form className="auth-form register-form" onSubmit={handleRegistration}>
              <label htmlFor="register-name">Full name</label>
              <input
                autoComplete="name"
                id="register-name"
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your name"
                required
                type="text"
                value={fullName}
              />
              <label htmlFor="register-email">Email address</label>
              <input
                autoComplete="email"
                id="register-email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
                type="email"
                value={email}
              />
              <label htmlFor="register-student-id">Student ID <span>(optional for demo)</span></label>
              <input
                id="register-student-id"
                onChange={(event) => setStudentId(event.target.value)}
                placeholder="Leave blank to create a demo ID"
                type="text"
                value={studentId}
              />
              <label htmlFor="register-password">Password</label>
              <div className="password-input-wrap">
                <input
                  autoComplete="new-password"
                  id="register-password"
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <label htmlFor="register-confirm-password">Confirm password</label>
              <input
                autoComplete="new-password"
                id="register-confirm-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                required
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
              />
              <p className="form-disclaimer">
                This creates a local prototype account only. Do not use a real
                password or enter private student information.
              </p>
              <button className="button button-primary auth-submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating account..." : "Create demo account"}
                <Icon name="arrow-right" />
              </button>
            </form>
          )}

          <p className="auth-footnote">
            <Icon name="info" />
            Frontend demo only. This is not secure authentication and does not
            connect to official university records.
          </p>
        </section>
      </div>
      <footer className="auth-footer">
        <span>© {new Date().getFullYear()} ALABATT-HUB · CODL</span>
        <span>For demonstration purposes only</span>
      </footer>
    </main>
  );
}
