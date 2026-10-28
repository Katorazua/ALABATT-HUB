"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { PortalBrand, PortalMessage, PrototypeBadge } from "@/components/portal/portal-ui";
import { clearActiveSession, readActiveSession } from "@/lib/portal/storage";
import { readAdminDemoState, writeAdminDemoState } from "@/lib/portal/admin-service";
import type {
  AdminCourseRecord,
  AdminDemoState,
  AdminInstructorRecord,
  AdminStudentRecord,
} from "@/lib/portal/types";

type AdminTab = "overview" | "students" | "instructors" | "courses" | "sessions" | "payments";

const tabs: { id: AdminTab; label: string; icon: "dashboard" | "people" | "book" | "calendar" | "wallet" }[] = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "students", label: "Students", icon: "people" },
  { id: "instructors", label: "Instructors", icon: "people" },
  { id: "courses", label: "Courses", icon: "book" },
  { id: "sessions", label: "Sessions", icon: "calendar" },
  { id: "payments", label: "Payments", icon: "wallet" },
];

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function makeStudentDraft(student?: AdminStudentRecord) {
  return {
    id: student?.id ?? "",
    studentId: student?.studentId ?? "",
    fullName: student?.fullName ?? "",
    email: student?.email ?? "",
    phone: student?.phone ?? "",
    programme: student?.programme ?? "",
    level: student?.level ?? "",
    enrollmentStatus: (student?.enrollmentStatus ?? "Active") as AdminStudentRecord["enrollmentStatus"],
    dateOfEnrollment: student?.dateOfEnrollment ?? new Date().toISOString().slice(0, 10),
    registeredCourses: student?.registeredCourses.join(", ") ?? "",
  };
}

function makeInstructorDraft(instructor?: AdminInstructorRecord) {
  return {
    id: instructor?.id ?? "",
    instructorId: instructor?.instructorId ?? "",
    fullName: instructor?.fullName ?? "",
    email: instructor?.email ?? "",
    phone: instructor?.phone ?? "",
    specialization: instructor?.specialization ?? "",
    assignedCourses: instructor?.assignedCourses.join(", ") ?? "",
    status: (instructor?.status ?? "Active") as AdminInstructorRecord["status"],
  };
}

function makeCourseDraft(course?: AdminCourseRecord) {
  return {
    id: course?.id ?? "",
    code: course?.code ?? "",
    title: course?.title ?? "",
    description: course?.description ?? "",
    programme: course?.programme ?? "",
    instructorId: course?.instructorId ?? "",
    creditUnits: course?.creditUnits ?? 2,
    registrationFee: course?.registrationFee ?? 10000,
    status: (course?.status ?? "Open") as AdminCourseRecord["status"],
    modules: course?.modules.join(", ") ?? "",
  };
}

function parseList(raw: string): string[] {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function AdminDashboard() {
  const router = useRouter();
  const [state, setState] = useState<AdminDemoState | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return readAdminDemoState();
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [notice, setNotice] = useState("");
  const [noticeKind, setNoticeKind] = useState<"info" | "success" | "error">("info");
  const [search, setSearch] = useState("");
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showInstructorForm, setShowInstructorForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [studentDraft, setStudentDraft] = useState(makeStudentDraft());
  const [instructorDraft, setInstructorDraft] = useState(makeInstructorDraft());
  const [courseDraft, setCourseDraft] = useState(makeCourseDraft());

  useEffect(() => {
    const session = readActiveSession();
    if (!session) {
      router.replace("/student-portal");
      return;
    }

    if (session.role !== "admin") {
      router.replace(session.role === "student" ? "/student-portal/dashboard" : "/student-portal");
    }
  }, [router]);

  const summary = useMemo(() => {
    if (!state) {
      return {
        students: 0,
        instructors: 0,
        courses: 0,
        registrations: 0,
        sessions: 0,
        paymentTotal: 0,
      };
    }

    return {
      students: state.students.length,
      instructors: state.instructors.length,
      courses: state.courses.length,
      registrations: state.students.reduce((total, student) => total + student.registeredCourses.length, 0),
      sessions: state.videoSessions.length,
      paymentTotal: state.paymentActivity.reduce((total, payment) => {
        const amount = payment.status === "Successful" ? payment.amount : 0;
        return total + amount;
      }, 0),
    };
  }, [state]);

  const filteredStudents = useMemo(() => {
    if (!state) return [];
    const query = search.toLowerCase();
    return state.students.filter((student) => {
      const searchable = [student.studentId, student.fullName, student.email, student.programme]
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [search, state]);

  const filteredInstructors = useMemo(() => {
    if (!state) return [];
    const query = search.toLowerCase();
    return state.instructors.filter((instructor) => {
      const searchable = [instructor.instructorId, instructor.fullName, instructor.email, instructor.specialization]
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [search, state]);

  const filteredCourses = useMemo(() => {
    if (!state) return [];
    const query = search.toLowerCase();
    return state.courses.filter((course) => {
      const searchable = [course.code, course.title, course.programme, course.instructorId].join(" ").toLowerCase();
      return searchable.includes(query);
    });
  }, [search, state]);

  function persist(nextState: AdminDemoState) {
    setState(nextState);
    writeAdminDemoState(nextState);
  }

  function showNotice(message: string, kind: "info" | "success" | "error" = "info") {
    setNotice(message);
    setNoticeKind(kind);
  }

  function handleStudentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state) return;

    const trimmedStudentId = studentDraft.studentId.trim();
    const trimmedEmail = studentDraft.email.trim();
    const trimmedFullName = studentDraft.fullName.trim();

    if (!trimmedStudentId || !trimmedEmail || !trimmedFullName || !studentDraft.programme.trim()) {
      showNotice("Student ID, full name, email, and programme are required.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showNotice("Enter a valid email address for the student record.", "error");
      return;
    }

    const duplicateId = state.students.some(
      (student) => student.studentId.toLowerCase() === trimmedStudentId.toLowerCase() && student.id !== studentDraft.id,
    );
    const duplicateEmail = state.students.some(
      (student) => student.email.toLowerCase() === trimmedEmail.toLowerCase() && student.id !== studentDraft.id,
    );

    if (duplicateId) {
      showNotice("Another student already uses that Student ID.", "error");
      return;
    }

    if (duplicateEmail) {
      showNotice("Another student already uses that email address.", "error");
      return;
    }

    const nextStudents: AdminStudentRecord[] = studentDraft.id
      ? state.students.map((student) =>
          student.id === studentDraft.id
            ? {
                ...student,
                studentId: trimmedStudentId,
                fullName: trimmedFullName,
                email: trimmedEmail,
                phone: studentDraft.phone.trim(),
                programme: studentDraft.programme.trim(),
                level: studentDraft.level.trim() || "Undeclared",
                enrollmentStatus: studentDraft.enrollmentStatus,
                dateOfEnrollment: studentDraft.dateOfEnrollment,
                registeredCourses: parseList(studentDraft.registeredCourses),
              }
            : student,
        )
      : [
          ...state.students,
          {
            id: crypto.randomUUID(),
            studentId: trimmedStudentId,
            fullName: trimmedFullName,
            email: trimmedEmail,
            phone: studentDraft.phone.trim(),
            programme: studentDraft.programme.trim(),
            level: studentDraft.level.trim() || "Undeclared",
            enrollmentStatus: studentDraft.enrollmentStatus,
            dateOfEnrollment: studentDraft.dateOfEnrollment,
            registeredCourses: parseList(studentDraft.registeredCourses),
          },
        ];

    persist({ ...state, students: nextStudents });
    setShowStudentForm(false);
    setStudentDraft(makeStudentDraft());
    showNotice(studentDraft.id ? "Student record updated." : "New student record created.", "success");
  }

  function handleInstructorSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state) return;

    const trimmedInstructorId = instructorDraft.instructorId.trim();
    const trimmedEmail = instructorDraft.email.trim();
    const trimmedFullName = instructorDraft.fullName.trim();

    if (!trimmedInstructorId || !trimmedEmail || !trimmedFullName || !instructorDraft.specialization.trim()) {
      showNotice("Instructor ID, name, email, and specialization are required.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showNotice("Enter a valid email address for the instructor record.", "error");
      return;
    }

    const duplicateId = state.instructors.some(
      (instructor) => instructor.instructorId.toLowerCase() === trimmedInstructorId.toLowerCase() && instructor.id !== instructorDraft.id,
    );
    const duplicateEmail = state.instructors.some(
      (instructor) => instructor.email.toLowerCase() === trimmedEmail.toLowerCase() && instructor.id !== instructorDraft.id,
    );

    if (duplicateId) {
      showNotice("Another instructor already uses that Instructor ID.", "error");
      return;
    }

    if (duplicateEmail) {
      showNotice("Another instructor already uses that email address.", "error");
      return;
    }

    const assignedCourses = parseList(instructorDraft.assignedCourses);
    const nextInstructors: AdminInstructorRecord[] = instructorDraft.id
      ? state.instructors.map((instructor) =>
          instructor.id === instructorDraft.id
            ? {
                ...instructor,
                instructorId: trimmedInstructorId,
                fullName: trimmedFullName,
                email: trimmedEmail,
                phone: instructorDraft.phone.trim(),
                specialization: instructorDraft.specialization.trim(),
                assignedCourses,
                status: instructorDraft.status,
              }
            : instructor,
        )
      : [
          ...state.instructors,
          {
            id: crypto.randomUUID(),
            instructorId: trimmedInstructorId,
            fullName: trimmedFullName,
            email: trimmedEmail,
            phone: instructorDraft.phone.trim(),
            specialization: instructorDraft.specialization.trim(),
            assignedCourses,
            status: instructorDraft.status,
          },
        ];

    const nextCourses = state.courses.map((course) => {
      if (!assignedCourses.includes(course.id)) return course;
      const matchingInstructor = nextInstructors.find((instructor) => instructor.assignedCourses.includes(course.id));
      return matchingInstructor ? { ...course, instructorId: matchingInstructor.id } : course;
    });

    persist({ ...state, instructors: nextInstructors, courses: nextCourses });
    setShowInstructorForm(false);
    setInstructorDraft(makeInstructorDraft());
    showNotice(instructorDraft.id ? "Instructor profile updated." : "New instructor profile added.", "success");
  }

  function handleCourseSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state) return;

    const trimmedCode = courseDraft.code.trim();
    const trimmedTitle = courseDraft.title.trim();

    if (!trimmedCode || !trimmedTitle || !courseDraft.description.trim() || !courseDraft.programme.trim()) {
      showNotice("Course code, title, description, and programme are required.", "error");
      return;
    }

    const duplicateCode = state.courses.some(
      (course) => course.code.toLowerCase() === trimmedCode.toLowerCase() && course.id !== courseDraft.id,
    );
    if (duplicateCode) {
      showNotice("Another course already uses that code.", "error");
      return;
    }

    const nextCourses: AdminCourseRecord[] = courseDraft.id
      ? state.courses.map((course) =>
          course.id === courseDraft.id
            ? {
                ...course,
                code: trimmedCode,
                title: trimmedTitle,
                description: courseDraft.description.trim(),
                programme: courseDraft.programme.trim(),
                instructorId: courseDraft.instructorId || course.instructorId,
                creditUnits: Number(courseDraft.creditUnits) || 0,
                registrationFee: Number(courseDraft.registrationFee) || 0,
                status: courseDraft.status,
                modules: parseList(courseDraft.modules),
              }
            : course,
        )
      : [
          ...state.courses,
          {
            id: crypto.randomUUID(),
            code: trimmedCode,
            title: trimmedTitle,
            description: courseDraft.description.trim(),
            programme: courseDraft.programme.trim(),
            instructorId: courseDraft.instructorId,
            creditUnits: Number(courseDraft.creditUnits) || 0,
            registrationFee: Number(courseDraft.registrationFee) || 0,
            status: courseDraft.status,
            modules: parseList(courseDraft.modules),
          },
        ];

    persist({ ...state, courses: nextCourses });
    setShowCourseForm(false);
    setCourseDraft(makeCourseDraft());
    showNotice(courseDraft.id ? "Course details updated." : "Course created successfully.", "success");
  }

  function deleteStudent(studentId: string) {
    if (!state) return;
    const target = state.students.find((student) => student.id === studentId);
    if (!target) return;
    const confirmed = window.confirm(`Delete ${target.fullName}? This action is irreversible in the demo state.`);
    if (!confirmed) return;

    const nextState = { ...state, students: state.students.filter((student) => student.id !== studentId) };
    persist(nextState);
    showNotice(`${target.fullName} was removed from the active demo records.`, "success");
  }

  function deleteInstructor(instructorId: string) {
    if (!state) return;
    const target = state.instructors.find((instructor) => instructor.id === instructorId);
    if (!target) return;
    const confirmed = window.confirm(`Delete ${target.fullName}? This action is irreversible in the demo state.`);
    if (!confirmed) return;

    const nextState = {
      ...state,
      instructors: state.instructors.filter((instructor) => instructor.id !== instructorId),
      courses: state.courses.map((course) =>
        course.instructorId === instructorId ? { ...course, instructorId: "" } : course,
      ),
    };
    persist(nextState);
    showNotice(`${target.fullName} was removed from the active instructor list.`, "success");
  }

  function deleteCourse(courseId: string) {
    if (!state) return;
    const target = state.courses.find((course) => course.id === courseId);
    if (!target) return;
    const hasRegistrations = state.students.some((student) => student.registeredCourses.includes(courseId));
    const confirmed = window.confirm(
      hasRegistrations
        ? `This course has student registrations. Archive it instead of deleting it?` 
        : `Delete ${target.title}? This action is irreversible in the demo state.`,
    );
    if (!confirmed) return;

    const nextState = {
      ...state,
      courses: state.courses.filter((course) => course.id !== courseId),
    };
    persist(nextState);
    showNotice(`${target.title} was removed from the active course list.`, "success");
  }

  if (!state) {
    return (
      <main className="portal-loading">
        <span className="portal-loading-mark"><Icon name="cap" /></span>
        <p>Preparing the admin portal…</p>
      </main>
    );
  }

  const activeInstructorName = (id: string) => {
    const instructor = state.instructors.find((item) => item.id === id);
    return instructor ? instructor.fullName : "Unassigned";
  };

  const currentPortalLabel = activeTab === "instructors" ? "Instructor's Dashboard" : "Admin Dashboard";

  return (
    <main className="admin-portal-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <PortalBrand light />
          <PrototypeBadge>ADMIN DEMO</PrototypeBadge>
        </div>
        <div className="admin-topbar-actions">
          <Link className="button button-secondary" href="/student-portal/dashboard">
            Student portal
          </Link>
          <button
            className="button button-primary"
            onClick={() => {
              clearActiveSession();
              router.replace("/student-portal");
            }}
            type="button"
          >
            <Icon name="logout" /> Log out
          </button>
        </div>
      </header>

      <section className="admin-hero">
        <div>
          <span className="portal-view-eyebrow">{currentPortalLabel}</span>
          <h1>{activeTab === "instructors" ? "Instructor operations" : "Operations dashboard"}</h1>
          <p>Monitor student enrollment, course oversight, and demo academic operations in one place.</p>
        </div>
      </section>

      {notice && <PortalMessage kind={noticeKind}>{notice}</PortalMessage>}

      <nav aria-label="Admin portal sections" className="admin-tab-list">
        {tabs.map((tab) => (
          <button
            aria-pressed={activeTab === tab.id}
            className={activeTab === tab.id ? "admin-tab-button is-selected" : "admin-tab-button"}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            <Icon name={tab.icon} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {activeTab === "overview" && (
        <>
          <div className="admin-summary-grid">
            <article className="admin-stat-card">
              <span className="portal-stat-icon stat-icon-blue"><Icon name="people" /></span>
              <div>
                <small>Total students</small>
                <strong>{summary.students}</strong>
              </div>
            </article>
            <article className="admin-stat-card">
              <span className="portal-stat-icon stat-icon-orange"><Icon name="profile" /></span>
              <div>
                <small>Total instructors</small>
                <strong>{summary.instructors}</strong>
              </div>
            </article>
            <article className="admin-stat-card">
              <span className="portal-stat-icon stat-icon-green"><Icon name="book" /></span>
              <div>
                <small>Total courses</small>
                <strong>{summary.courses}</strong>
              </div>
            </article>
            <article className="admin-stat-card">
              <span className="portal-stat-icon stat-icon-purple"><Icon name="edit" /></span>
              <div>
                <small>Course registrations</small>
                <strong>{summary.registrations}</strong>
              </div>
            </article>
            <article className="admin-stat-card">
              <span className="portal-stat-icon stat-icon-yellow"><Icon name="calendar" /></span>
              <div>
                <small>Scheduled sessions</small>
                <strong>{summary.sessions}</strong>
              </div>
            </article>
            <article className="admin-stat-card">
              <span className="portal-stat-icon stat-icon-teal"><Icon name="wallet" /></span>
              <div>
                <small>Payment summary</small>
                <strong>{currencyFormatter.format(summary.paymentTotal)}</strong>
              </div>
            </article>
          </div>

          <div className="admin-grid-two">
            <section className="admin-panel">
              <div className="admin-panel-header">
                <h2>Recent student registrations</h2>
              </div>
              <div className="admin-list compact">
                {state.students.slice(0, 4).map((student) => (
                  <div className="admin-list-item" key={student.id}>
                    <div>
                      <strong>{student.fullName}</strong>
                      <small>{student.programme}</small>
                    </div>
                    <span className="status-badge">{student.enrollmentStatus}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-header">
                <h2>Recently created courses</h2>
              </div>
              <div className="admin-list compact">
                {state.courses.slice(0, 4).map((course) => (
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
          </div>

          <div className="admin-grid-two">
            <section className="admin-panel">
              <div className="admin-panel-header">
                <h2>Upcoming video sessions</h2>
              </div>
              <div className="admin-list compact">
                {state.videoSessions.map((session) => (
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

            <section className="admin-panel">
              <div className="admin-panel-header">
                <h2>Quick actions</h2>
              </div>
              <div className="admin-action-stack">
                <button className="portal-small-button" onClick={() => { setShowStudentForm(true); setStudentDraft(makeStudentDraft()); setActiveTab("students"); }} type="button">Add student</button>
                <button className="portal-small-button" onClick={() => { setShowInstructorForm(true); setInstructorDraft(makeInstructorDraft()); setActiveTab("instructors"); }} type="button">Add instructor</button>
                <button className="portal-small-button" onClick={() => { setShowCourseForm(true); setCourseDraft(makeCourseDraft()); setActiveTab("courses"); }} type="button">Create course</button>
              </div>
            </section>
          </div>
        </>
      )}

      {activeTab === "students" && (
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Student management</h2>
            <button className="portal-small-button" onClick={() => { setShowStudentForm((visible) => !visible); if (!showStudentForm) setStudentDraft(makeStudentDraft()); }} type="button">
              {showStudentForm ? "Close form" : "Add student"}
            </button>
          </div>

          <input
            className="admin-filter-input"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search students by name, ID, programme, or email"
            type="search"
            value={search}
          />

          {showStudentForm && (
            <form className="admin-form" onSubmit={handleStudentSubmit}>
              <div className="admin-form-grid">
                <label><span>Student ID</span><input value={studentDraft.studentId} onChange={(event) => setStudentDraft({ ...studentDraft, studentId: event.target.value })} /></label>
                <label><span>Full name</span><input value={studentDraft.fullName} onChange={(event) => setStudentDraft({ ...studentDraft, fullName: event.target.value })} /></label>
                <label><span>Email</span><input type="email" value={studentDraft.email} onChange={(event) => setStudentDraft({ ...studentDraft, email: event.target.value })} /></label>
                <label><span>Phone</span><input value={studentDraft.phone} onChange={(event) => setStudentDraft({ ...studentDraft, phone: event.target.value })} /></label>
                <label><span>Programme</span><input value={studentDraft.programme} onChange={(event) => setStudentDraft({ ...studentDraft, programme: event.target.value })} /></label>
                <label><span>Level</span><input value={studentDraft.level} onChange={(event) => setStudentDraft({ ...studentDraft, level: event.target.value })} /></label>
                <label><span>Enrollment status</span><select value={studentDraft.enrollmentStatus} onChange={(event) => setStudentDraft({ ...studentDraft, enrollmentStatus: event.target.value as AdminStudentRecord["enrollmentStatus"] })}><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Pending">Pending</option></select></label>
                <label><span>Date of enrollment</span><input type="date" value={studentDraft.dateOfEnrollment} onChange={(event) => setStudentDraft({ ...studentDraft, dateOfEnrollment: event.target.value })} /></label>
                <label className="admin-form-span"><span>Registered courses (comma separated)</span><input value={studentDraft.registeredCourses} onChange={(event) => setStudentDraft({ ...studentDraft, registeredCourses: event.target.value })} /></label>
              </div>
              <div className="admin-form-actions">
                <button className="button button-primary" type="submit">{studentDraft.id ? "Save student" : "Create student"}</button>
                <button className="button button-secondary" onClick={() => { setShowStudentForm(false); setStudentDraft(makeStudentDraft()); }} type="button">Cancel</button>
              </div>
            </form>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Programme</th>
                  <th>Status</th>
                  <th>Enrollment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.studentId}</td>
                    <td>
                      <strong>{student.fullName}</strong>
                      <small>{student.email}</small>
                    </td>
                    <td>{student.programme}</td>
                    <td><span className="status-badge">{student.enrollmentStatus}</span></td>
                    <td>{formatDate(student.dateOfEnrollment)}</td>
                    <td className="admin-actions-cell">
                      <button className="inline-action" onClick={() => { setStudentDraft(makeStudentDraft(student)); setShowStudentForm(true); }} type="button">Edit</button>
                      <button className="inline-action danger" onClick={() => deleteStudent(student.id)} type="button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "instructors" && (
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Instructor management</h2>
            <button className="portal-small-button" onClick={() => { setShowInstructorForm((visible) => !visible); if (!showInstructorForm) setInstructorDraft(makeInstructorDraft()); }} type="button">
              {showInstructorForm ? "Close form" : "Add instructor"}
            </button>
          </div>

          <input
            className="admin-filter-input"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search instructors by name, ID, or specialization"
            type="search"
            value={search}
          />

          {showInstructorForm && (
            <form className="admin-form" onSubmit={handleInstructorSubmit}>
              <div className="admin-form-grid">
                <label><span>Instructor ID</span><input value={instructorDraft.instructorId} onChange={(event) => setInstructorDraft({ ...instructorDraft, instructorId: event.target.value })} /></label>
                <label><span>Full name</span><input value={instructorDraft.fullName} onChange={(event) => setInstructorDraft({ ...instructorDraft, fullName: event.target.value })} /></label>
                <label><span>Email</span><input type="email" value={instructorDraft.email} onChange={(event) => setInstructorDraft({ ...instructorDraft, email: event.target.value })} /></label>
                <label><span>Phone</span><input value={instructorDraft.phone} onChange={(event) => setInstructorDraft({ ...instructorDraft, phone: event.target.value })} /></label>
                <label><span>Specialization</span><input value={instructorDraft.specialization} onChange={(event) => setInstructorDraft({ ...instructorDraft, specialization: event.target.value })} /></label>
                <label><span>Status</span><select value={instructorDraft.status} onChange={(event) => setInstructorDraft({ ...instructorDraft, status: event.target.value as AdminInstructorRecord["status"] })}><option value="Active">Active</option><option value="On Leave">On Leave</option><option value="Inactive">Inactive</option></select></label>
                <label className="admin-form-span"><span>Assigned courses (IDs or names, comma separated)</span><input value={instructorDraft.assignedCourses} onChange={(event) => setInstructorDraft({ ...instructorDraft, assignedCourses: event.target.value })} /></label>
              </div>
              <div className="admin-form-actions">
                <button className="button button-primary" type="submit">{instructorDraft.id ? "Save instructor" : "Create instructor"}</button>
                <button className="button button-secondary" onClick={() => { setShowInstructorForm(false); setInstructorDraft(makeInstructorDraft()); }} type="button">Cancel</button>
              </div>
            </form>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Instructor ID</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Assigned courses</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors.map((instructor) => (
                  <tr key={instructor.id}>
                    <td>{instructor.instructorId}</td>
                    <td>
                      <strong>{instructor.fullName}</strong>
                      <small>{instructor.email}</small>
                    </td>
                    <td>{instructor.specialization}</td>
                    <td>{instructor.assignedCourses.length > 0 ? instructor.assignedCourses.join(", ") : "No courses"}</td>
                    <td><span className="status-badge">{instructor.status}</span></td>
                    <td className="admin-actions-cell">
                      <button className="inline-action" onClick={() => { setInstructorDraft(makeInstructorDraft(instructor)); setShowInstructorForm(true); }} type="button">Edit</button>
                      <button className="inline-action danger" onClick={() => deleteInstructor(instructor.id)} type="button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "courses" && (
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Course management</h2>
            <button className="portal-small-button" onClick={() => { setShowCourseForm((visible) => !visible); if (!showCourseForm) setCourseDraft(makeCourseDraft()); }} type="button">
              {showCourseForm ? "Close form" : "Create course"}
            </button>
          </div>

          <input
            className="admin-filter-input"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses by code, title, or programme"
            type="search"
            value={search}
          />

          {showCourseForm && (
            <form className="admin-form" onSubmit={handleCourseSubmit}>
              <div className="admin-form-grid">
                <label><span>Course code</span><input value={courseDraft.code} onChange={(event) => setCourseDraft({ ...courseDraft, code: event.target.value })} /></label>
                <label><span>Course title</span><input value={courseDraft.title} onChange={(event) => setCourseDraft({ ...courseDraft, title: event.target.value })} /></label>
                <label><span>Programme</span><input value={courseDraft.programme} onChange={(event) => setCourseDraft({ ...courseDraft, programme: event.target.value })} /></label>
                <label><span>Instructor</span>
                  <select value={courseDraft.instructorId} onChange={(event) => setCourseDraft({ ...courseDraft, instructorId: event.target.value })}>
                    <option value="">Unassigned</option>
                    {state.instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>{instructor.fullName}</option>
                    ))}
                  </select>
                </label>
                <label><span>Credit units</span><input min="0" type="number" value={courseDraft.creditUnits} onChange={(event) => setCourseDraft({ ...courseDraft, creditUnits: Number(event.target.value) })} /></label>
                <label><span>Registration fee</span><input min="0" type="number" value={courseDraft.registrationFee} onChange={(event) => setCourseDraft({ ...courseDraft, registrationFee: Number(event.target.value) })} /></label>
                <label><span>Course status</span><select value={courseDraft.status} onChange={(event) => setCourseDraft({ ...courseDraft, status: event.target.value as AdminCourseRecord["status"] })}><option value="Open">Open</option><option value="Closed">Closed</option><option value="Draft">Draft</option></select></label>
                <label className="admin-form-span"><span>Learning modules (comma separated)</span><input value={courseDraft.modules} onChange={(event) => setCourseDraft({ ...courseDraft, modules: event.target.value })} /></label>
                <label className="admin-form-span"><span>Description</span><textarea value={courseDraft.description} onChange={(event) => setCourseDraft({ ...courseDraft, description: event.target.value })} /></label>
              </div>
              <div className="admin-form-actions">
                <button className="button button-primary" type="submit">{courseDraft.id ? "Save course" : "Create course"}</button>
                <button className="button button-secondary" onClick={() => { setShowCourseForm(false); setCourseDraft(makeCourseDraft()); }} type="button">Cancel</button>
              </div>
            </form>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.code}</td>
                    <td>
                      <strong>{course.title}</strong>
                      <small>{course.programme}</small>
                    </td>
                    <td>{activeInstructorName(course.instructorId)}</td>
                    <td>{currencyFormatter.format(course.registrationFee)}</td>
                    <td><span className="status-badge">{course.status}</span></td>
                    <td className="admin-actions-cell">
                      <button className="inline-action" onClick={() => { setCourseDraft(makeCourseDraft(course)); setShowCourseForm(true); }} type="button">Edit</button>
                      <button className="inline-action danger" onClick={() => deleteCourse(course.id)} type="button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "sessions" && (
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Video session scheduling</h2>
          </div>
          <div className="admin-list compact">
            {state.videoSessions.map((session) => (
              <div className="admin-list-item large" key={session.id}>
                <div>
                  <strong>{session.title}</strong>
                  <small>{session.date} at {session.time} · {session.host}</small>
                </div>
                <div className="admin-meta-row">
                  <span className="status-badge">{session.status}</span>
                  <a href={session.link} rel="noreferrer" target="_blank">Open link</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "payments" && (
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Registration and payment activity</h2>
          </div>
          <div className="admin-list compact">
            {state.paymentActivity.map((payment) => (
              <div className="admin-list-item large" key={payment.id}>
                <div>
                  <strong>{payment.description}</strong>
                  <small>{payment.reference} · {formatDate(payment.date)}</small>
                </div>
                <div className="admin-meta-row">
                  <strong>{currencyFormatter.format(payment.amount)}</strong>
                  <span className="status-badge">{payment.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
