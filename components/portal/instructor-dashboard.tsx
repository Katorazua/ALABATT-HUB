"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { PortalBrand, PrototypeBadge } from "@/components/portal/portal-ui";
import {
  DEMO_ADMIN_COURSES,
  DEMO_INSTRUCTORS,
  DEMO_VIDEO_SESSIONS,
} from "@/lib/portal/demo-data";
import { clearActiveSession, readActiveSession } from "@/lib/portal/storage";
import type { AdminInstructorRecord } from "@/lib/portal/types";

export function InstructorDashboard() {
  const router = useRouter();
  const [instructor] = useState<AdminInstructorRecord | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const session = readActiveSession();
    if (!session || session.role === "student" || session.role === "admin") {
      return null;
    }

    const match = DEMO_INSTRUCTORS.find(
      (item) => item.email.toLowerCase() === session.email.toLowerCase(),
    ) ?? DEMO_INSTRUCTORS[0];

    return {
      ...match,
      assignedCourses: [...match.assignedCourses],
    };
  });

  useEffect(() => {
    const session = readActiveSession();
    if (!session) {
      router.replace("/student-portal");
      return;
    }

    if (session.role === "student") {
      router.replace("/student-portal/dashboard");
      return;
    }

    if (session.role === "admin") {
      router.replace("/admin-portal/dashboard");
      return;
    }

    if (!instructor) {
      router.replace("/student-portal");
    }
  }, [instructor, router]);

  const assignedCourses = useMemo(
    () => DEMO_ADMIN_COURSES.filter((course) => course.instructorId === instructor?.id),
    [instructor],
  );

  const upcomingSessions = useMemo(
    () =>
      DEMO_VIDEO_SESSIONS.filter((session) =>
        session.host.includes(instructor?.fullName.split(" ")[0] ?? "") ||
        session.host === instructor?.fullName,
      ),
    [instructor],
  );

  function logout() {
    clearActiveSession();
    router.replace("/student-portal");
  }

  if (!instructor) {
    return (
      <main className="portal-loading">
        <span className="portal-loading-mark"><Icon name="cap" /></span>
        <p>Loading the instructor dashboard…</p>
      </main>
    );
  }

  return (
    <main className="admin-portal-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <PortalBrand light />
          <PrototypeBadge>INSTRUCTOR DEMO</PrototypeBadge>
        </div>
        <div className="admin-topbar-actions">
          <Link className="button button-secondary" href="/student-portal/dashboard">
            Student portal
          </Link>
          <button className="button button-primary" onClick={logout} type="button">
            <Icon name="logout" /> Log out
          </button>
        </div>
      </header>

      <section className="admin-hero">
        <div>
          <span className="portal-view-eyebrow">Instructor&apos;s Dashboard</span>
          <h1>{instructor.fullName}</h1>
          <p>Track your current demo learning assignments, course delivery and upcoming sessions.</p>
        </div>
      </section>

      <div className="admin-summary-grid">
        <article className="admin-stat-card">
          <span className="portal-stat-icon stat-icon-blue"><Icon name="book" /></span>
          <div>
            <small>Assigned courses</small>
            <strong>{assignedCourses.length}</strong>
          </div>
        </article>
        <article className="admin-stat-card">
          <span className="portal-stat-icon stat-icon-green"><Icon name="calendar" /></span>
          <div>
            <small>Upcoming sessions</small>
            <strong>{upcomingSessions.length}</strong>
          </div>
        </article>
        <article className="admin-stat-card">
          <span className="portal-stat-icon stat-icon-orange"><Icon name="people" /></span>
          <div>
            <small>Specialization</small>
            <strong>{instructor.specialization}</strong>
          </div>
        </article>
      </div>

      <div className="admin-grid-two">
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Assigned courses</h2>
          </div>
          <div className="admin-list compact">
            {assignedCourses.map((course) => (
              <div className="admin-list-item" key={course.id}>
                <div>
                  <strong>{course.code}</strong>
                  <small>{course.title}</small>
                </div>
                <span className="status-badge">{course.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Session schedule</h2>
          </div>
          <div className="admin-list compact">
            {upcomingSessions.map((session) => (
              <div className="admin-list-item" key={session.id}>
                <div>
                  <strong>{session.title}</strong>
                  <small>{session.date} · {session.time}</small>
                </div>
                <span className="status-badge">{session.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
