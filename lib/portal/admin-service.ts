import {
  DEMO_ADMIN_COURSES,
  DEMO_INSTRUCTORS,
  DEMO_PAYMENT_ACTIVITY,
  DEMO_STUDENTS,
  DEMO_VIDEO_SESSIONS,
} from "@/lib/portal/demo-data";
import type {
  AdminCourseRecord,
  AdminDemoState,
  AdminInstructorRecord,
  AdminStudentRecord,
  AdminVideoSession,
  Payment,
} from "@/lib/portal/types";

const ADMIN_STATE_KEY = "alabatt-hub-admin-demo-state-v1";

function cloneStudents(): AdminStudentRecord[] {
  return DEMO_STUDENTS.map((student) => ({ ...student, registeredCourses: [...student.registeredCourses] }));
}

function cloneInstructors(): AdminInstructorRecord[] {
  return DEMO_INSTRUCTORS.map((instructor) => ({ ...instructor, assignedCourses: [...instructor.assignedCourses] }));
}

function cloneCourses(): AdminCourseRecord[] {
  return DEMO_ADMIN_COURSES.map((course) => ({ ...course, modules: [...course.modules] }));
}

function cloneSessions(): AdminVideoSession[] {
  return DEMO_VIDEO_SESSIONS.map((session) => ({ ...session }));
}

function clonePayments(): Payment[] {
  return DEMO_PAYMENT_ACTIVITY.map((payment) => ({ ...payment }));
}

export function createInitialAdminState(): AdminDemoState {
  return {
    students: cloneStudents(),
    instructors: cloneInstructors(),
    courses: cloneCourses(),
    videoSessions: cloneSessions(),
    paymentActivity: clonePayments(),
  };
}

export function readAdminDemoState(): AdminDemoState {
  if (typeof window === "undefined") {
    return createInitialAdminState();
  }

  const raw = window.localStorage.getItem(ADMIN_STATE_KEY);
  if (!raw) {
    const initial = createInitialAdminState();
    window.localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AdminDemoState>;
    if (!parsed || !Array.isArray(parsed.students) || !Array.isArray(parsed.instructors) || !Array.isArray(parsed.courses)) {
      throw new Error("Invalid admin demo data");
    }

    return {
      students: parsed.students.map((student) => ({
        ...student,
        registeredCourses: Array.isArray(student.registeredCourses) ? [...student.registeredCourses] : [],
      })),
      instructors: parsed.instructors.map((instructor) => ({
        ...instructor,
        assignedCourses: Array.isArray(instructor.assignedCourses) ? [...instructor.assignedCourses] : [],
      })),
      courses: parsed.courses.map((course) => ({
        ...course,
        modules: Array.isArray(course.modules) ? [...course.modules] : [],
      })),
      videoSessions: Array.isArray(parsed.videoSessions) ? parsed.videoSessions.map((session) => ({ ...session })) : cloneSessions(),
      paymentActivity: Array.isArray(parsed.paymentActivity) ? parsed.paymentActivity.map((payment) => ({ ...payment })) : clonePayments(),
    };
  } catch {
    const initial = createInitialAdminState();
    window.localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(initial));
    return initial;
  }
}

export function writeAdminDemoState(state: AdminDemoState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(state));
}
