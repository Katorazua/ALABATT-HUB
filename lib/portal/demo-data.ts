import type {
  Course,
  Payment,
  StudentData,
  StudentIdentity,
  StudentNotification,
} from "@/lib/portal/types";

export const DEMO_LOGIN_EMAIL = "demo.student@alabatt-demo.test";
export const DEMO_LOGIN_PASSWORD = "CODLdemo2026!";

export const DEMO_IDENTITY: StudentIdentity = {
  id: "codl-demo-student",
  fullName: "Jane Doe",
  email: DEMO_LOGIN_EMAIL,
  studentId: "CODL-DEMO-001",
};

export const COURSE_CATALOG: Course[] = [
  {
    id: "codl-101",
    code: "CODL 101",
    title: "Foundations of Open Learning",
    creditUnits: 2,
    semester: "First semester · Demo",
  },
  {
    id: "com-112",
    code: "COM 112",
    title: "Communication Skills",
    creditUnits: 2,
    semester: "First semester · Demo",
  },
  {
    id: "ict-104",
    code: "ICT 104",
    title: "Digital Study Skills",
    creditUnits: 3,
    semester: "First semester · Demo",
  },
  {
    id: "edu-120",
    code: "EDU 120",
    title: "Introduction to Learning",
    creditUnits: 2,
    semester: "First semester · Demo",
  },
];

export const DEMO_PAYMENTS: Payment[] = [
  {
    id: "payment-pending-demo",
    description: "Sample academic service fee",
    amount: 12500,
    date: "2026-09-10",
    reference: "SAMPLE-PENDING-001",
    status: "Pending",
  },
  {
    id: "payment-success-demo",
    description: "Sample learning resource fee",
    amount: 5000,
    date: "2026-08-20",
    reference: "SAMPLE-PAID-002",
    status: "Successful",
  },
  {
    id: "payment-failed-demo",
    description: "Sample registration fee",
    amount: 8500,
    date: "2026-08-12",
    reference: "SAMPLE-FAILED-003",
    status: "Failed",
  },
];

export const DEMO_NOTIFICATIONS: StudentNotification[] = [
  {
    id: "welcome-demo",
    title: "Welcome to the student portal demo",
    message:
      "This sample account demonstrates the kind of updates a connected student portal may provide.",
    category: "Getting started",
    createdAt: "2026-09-01T09:00:00.000Z",
    read: false,
  },
  {
    id: "course-demo",
    title: "Course information",
    message:
      "Course names and registration outcomes shown here are sample data, not official university records.",
    category: "Academic information",
    createdAt: "2026-09-03T10:30:00.000Z",
    read: false,
  },
  {
    id: "payment-demo",
    title: "Payment simulation notice",
    message:
      "Demo payment actions do not contact a payment provider or transfer money.",
    category: "Service notice",
    createdAt: "2026-09-05T13:15:00.000Z",
    read: true,
  },
];

export function createInitialStudentData(identity: StudentIdentity): StudentData {
  const isDemoAccount = identity.email.toLowerCase() === DEMO_LOGIN_EMAIL;

  return {
    version: 1,
    profile: {
      fullName: identity.fullName,
      email: identity.email,
      studentId: identity.studentId,
      phone: "",
      address: "",
      programme: "Demo student account",
    },
    registeredCourseIds: isDemoAccount ? ["codl-101", "com-112"] : [],
    payments: isDemoAccount ? DEMO_PAYMENTS.map((payment) => ({ ...payment })) : [],
    notifications: DEMO_NOTIFICATIONS.map((notification) => ({
      ...notification,
    })),
    activities: [],
  };
}
