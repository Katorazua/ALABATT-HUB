"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { PortalBrand, PortalMessage, PrototypeBadge } from "@/components/portal/portal-ui";
import {
  COURSE_CATALOG,
  DEMO_IDENTITY,
} from "@/lib/portal/demo-data";
import {
  clearActiveSession,
  readActiveSession,
  readDemoAccounts,
} from "@/lib/portal/storage";
import {
  addCourse,
  loadStudentData,
  markNotificationRead,
  persistStudentData,
  removeCourse,
  resetStudentData,
  saveProfile,
  simulatePayment,
} from "@/lib/portal/student-service";
import type {
  StudentData,
  StudentIdentity,
  StudentProfile,
} from "@/lib/portal/types";
import {
  CourseRegistrationView,
  CoursesView,
  DashboardOverview,
  NotificationsView,
  PaymentsView,
  PlaceholderView,
  PORTAL_NAVIGATION,
  ProfileView,
  ResourcesView,
  SettingsView,
  type PortalView,
} from "@/components/portal/dashboard-views";

const placeholderContent: Partial<
  Record<PortalView, { title: string; description: string }>
> = {
  grades: {
    title: "Grades",
    description:
      "Official grades and academic results are not connected to this frontend demo.",
  },
  attendance: {
    title: "Attendance",
    description:
      "Attendance information will be available when an approved university service is connected.",
  },
  timetable: {
    title: "Time Table",
    description:
      "No official class timetable is available in this prototype.",
  },
  exams: {
    title: "Examination Information",
    description:
      "Exam schedules and examination records are not provided by this demo.",
  },
  complaint: {
    title: "Help & Contact",
    description:
      "Use the public CODL contact section for confirmed university contact information.",
  },
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "S";
}

export function DashboardShell() {
  const router = useRouter();
  const [identity, setIdentity] = useState<StudentIdentity | null>(null);
  const [data, setData] = useState<StudentData | null>(null);
  const [activeView, setActiveView] = useState<PortalView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeKind, setNoticeKind] = useState<"info" | "success" | "error">("info");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;
    async function hydrateDashboard() {
      await Promise.resolve();
      try {
        const session = readActiveSession();
        if (!session) {
          router.replace("/student-portal");
          return;
        }

        const currentIdentity =
          session.email.toLowerCase() === DEMO_IDENTITY.email.toLowerCase()
            ? DEMO_IDENTITY
            : readDemoAccounts().find(
                (account) => account.email.toLowerCase() === session.email.toLowerCase(),
              );

        if (!currentIdentity) {
          clearActiveSession();
          router.replace("/student-portal");
          return;
        }

        if (!active) return;
        setIdentity(currentIdentity);
        setData(loadStudentData(currentIdentity));
      } catch (error) {
        if (!active) return;
        setNotice(getErrorMessage(error, "Saved demo information could not be loaded."));
        setNoticeKind("error");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void hydrateDashboard();
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!sidebarOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSidebarOpen(false);
      if (window.matchMedia("(max-width: 760px)").matches) {
        menuToggleRef.current?.focus();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen]);

  const unreadCount = useMemo(
    () => data?.notifications.filter((notification) => !notification.read).length ?? 0,
    [data],
  );

  function showNotice(message: string, kind: "info" | "success" | "error" = "info") {
    setNotice(message);
    setNoticeKind(kind);
  }

  function closeSidebar() {
    setSidebarOpen(false);
    if (window.matchMedia("(max-width: 760px)").matches) {
      menuToggleRef.current?.focus();
    }
  }

  function toggleSidebar() {
    if (sidebarOpen) {
      closeSidebar();
      return;
    }

    setSidebarOpen(true);
    window.setTimeout(() => {
      document.querySelector<HTMLButtonElement>(".portal-nav-item.is-active")?.focus();
    }, 0);
  }

  function commitData(nextData: StudentData, message: string) {
    if (!identity) return;
    try {
      persistStudentData(identity, nextData);
      setData(nextData);
      showNotice(message, "success");
    } catch (error) {
      showNotice(getErrorMessage(error, "The demo update could not be saved."), "error");
    }
  }

  function runDataChange(
    change: (currentData: StudentData) => StudentData,
    successMessage: string,
  ) {
    if (!data) return;
    try {
      commitData(change(data), successMessage);
    } catch (error) {
      showNotice(getErrorMessage(error, "The demo update could not be completed."), "error");
    }
  }

  function handlePayment(paymentId: string) {
    if (!data || !identity) return;
    try {
      const result = simulatePayment(data, paymentId);
      commitData(result.data, "Payment simulation completed. No money was transferred.");
    } catch (error) {
      showNotice(getErrorMessage(error, "The payment simulation could not be completed."), "error");
    }
  }

  function handleResourceUnavailable(title: string) {
    showNotice(`${title} is a sample listing. No university file is attached.`);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim().toLowerCase();
    if (!query) {
      showNotice("Enter a section or sample course to search.");
      return;
    }

    const matchingView = PORTAL_NAVIGATION.flatMap((group) => group.items).find(
      (item) => item.label.toLowerCase().includes(query),
    );
    if (matchingView) {
      setActiveView(matchingView.id);
      setSidebarOpen(false);
      showNotice(`Showing ${matchingView.label}.`);
      return;
    }

    const matchingCourse = COURSE_CATALOG.some(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query),
    );
    if (matchingCourse) {
      setActiveView("registration");
      setSidebarOpen(false);
      showNotice("Matching sample courses are shown in Course Registration.");
      return;
    }

    showNotice("No matching section or sample course was found.");
  }

  function logout() {
    try {
      clearActiveSession();
      router.replace("/student-portal");
    } catch (error) {
      showNotice(getErrorMessage(error, "The demo session could not be cleared."), "error");
    }
  }

  if (isLoading) {
    return (
      <main className="portal-loading">
        <span className="portal-loading-mark"><Icon name="cap" /></span>
        <p>Loading the student portal demo…</p>
      </main>
    );
  }

  if (!identity || !data) {
    return (
      <main className="portal-loading portal-loading-error">
        <PortalBrand />
        <PortalMessage kind={noticeKind}>
          {notice || "Your demo session could not be loaded."}
        </PortalMessage>
        <Link className="button button-primary" href="/student-portal">
          Return to demo sign in
        </Link>
      </main>
    );
  }

  const activeIdentity = identity;
  const activeData = data;
  const activeLabel =
    PORTAL_NAVIGATION.flatMap((group) => group.items).find(
      (item) => item.id === activeView,
    )?.label ?? "Dashboard";

  function renderActiveView() {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview data={activeData} onNavigate={setActiveView} />;
      case "profile":
        return (
          <ProfileView
            onSave={(profile: StudentProfile) =>
              runDataChange(
                (currentData) => saveProfile(currentData, profile),
                "Your demo profile was saved on this browser.",
              )
            }
            profile={activeData.profile}
          />
        );
      case "registration":
        return (
          <CourseRegistrationView
            data={activeData}
            onAdd={(courseId) =>
              runDataChange(
                (currentData) => addCourse(currentData, courseId),
                "The sample course was added to your demo list.",
              )
            }
          />
        );
      case "courses":
        return (
          <CoursesView
            data={activeData}
            onRemove={(courseId) =>
              runDataChange(
                (currentData) => removeCourse(currentData, courseId),
                "The sample course was removed from your demo list.",
              )
            }
          />
        );
      case "payments":
        return <PaymentsView onSimulate={handlePayment} payments={activeData.payments} />;
      case "resources":
        return <ResourcesView onUnavailable={handleResourceUnavailable} />;
      case "notifications":
        return (
          <NotificationsView
            notifications={activeData.notifications}
            onMarkRead={(notificationId) =>
              runDataChange(
                (currentData) => markNotificationRead(currentData, notificationId),
                "Notification marked as read.",
              )
            }
          />
        );
      case "settings":
        return (
          <SettingsView
            onReset={() => {
              if (!activeIdentity) return;
              try {
                const initialData = resetStudentData(activeIdentity);
                setData(initialData);
                showNotice("Demo profile and records were reset.", "success");
              } catch (error) {
                showNotice(getErrorMessage(error, "Demo data could not be reset."), "error");
              }
            }}
          />
        );
      default: {
        const content = placeholderContent[activeView];
        return content ? (
          <PlaceholderView description={content.description} title={content.title} />
        ) : null;
      }
    }
  }

  return (
    <div className="portal-app">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="portal-sidebar-scrim"
          onClick={closeSidebar}
          type="button"
        />
      )}
      <aside
        className={`portal-sidebar${sidebarOpen ? " is-open" : ""}`}
        id="student-portal-sidebar"
      >
        <div className="portal-sidebar-brand-row">
          <PortalBrand light />
          <button
            aria-label="Close navigation"
            className="portal-sidebar-close"
            onClick={closeSidebar}
            type="button"
          >
            <Icon name="x" />
          </button>
        </div>
        <div className="portal-sidebar-section-label">STUDENT PORTAL</div>
        <nav aria-label="Student portal navigation" className="portal-sidebar-nav">
          {PORTAL_NAVIGATION.map((group) => (
            <div className="portal-nav-group" key={group.group}>
              <span className="portal-nav-group-label">{group.group}</span>
              {group.items.map((item) => (
                <button
                  aria-current={activeView === item.id ? "page" : undefined}
                  className={`portal-nav-item${activeView === item.id ? " is-active" : ""}`}
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    closeSidebar();
                    setNotice("");
                  }}
                  type="button"
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {item.id === "notifications" && unreadCount > 0 && (
                    <span className="nav-count">{unreadCount}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="portal-sidebar-bottom">
          <div className="sidebar-demo-note"><span /> Frontend demo environment</div>
          <button className="portal-logout-button" onClick={logout} type="button">
            <Icon name="logout" /> Log out
          </button>
        </div>
      </aside>

      <div className="portal-main-column">
        <header className="portal-topbar">
          <button
            aria-controls="student-portal-sidebar"
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? "Close student portal navigation" : "Open student portal navigation"}
            className="portal-menu-toggle"
            onClick={toggleSidebar}
            ref={menuToggleRef}
            type="button"
          >
            <Icon name={sidebarOpen ? "x" : "menu"} />
          </button>
          <form className="portal-search" onSubmit={handleSearch} role="search">
            <Icon name="search" />
            <input
              aria-label="Search portal sections and sample courses"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search sections or courses"
              type="search"
              value={search}
            />
            <button aria-label="Search" type="submit"><Icon name="arrow-right" /></button>
          </form>
          <div className="portal-topbar-actions">
            <button
              aria-label={`Notifications, ${unreadCount} unread`}
              className="portal-topbar-icon"
              onClick={() => setActiveView("notifications")}
              type="button"
            >
              <Icon name="notification" />
              {unreadCount > 0 && <span className="topbar-notification-dot" />}
            </button>
            <span aria-hidden="true" className="topbar-divider" />
            <button
              className="portal-user-chip"
              onClick={() => setActiveView("profile")}
              type="button"
            >
              <span className="portal-avatar">{initials(activeData.profile.fullName)}</span>
              <span className="portal-user-name">
                <strong>{activeData.profile.fullName}</strong>
                <small>{activeData.profile.studentId}</small>
              </span>
              <Icon name="arrow-down" />
            </button>
          </div>
        </header>

        <main className="portal-content" id="portal-main">
          <div className="portal-content-topline">
            <div className="portal-breadcrumb">
              <span>Student portal</span><span>/</span><strong>{activeLabel}</strong>
            </div>
            <PrototypeBadge>FRONTEND PROTOTYPE</PrototypeBadge>
          </div>
          {notice && <PortalMessage kind={noticeKind}>{notice}</PortalMessage>}
          {renderActiveView()}
          <footer className="portal-content-footer">
            <span>ALABATT-HUB · Centre for Open and Distance Learning</span>
            <span>Demo information only · Not an official student record</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
