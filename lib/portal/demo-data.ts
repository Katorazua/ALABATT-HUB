import type {
  Course,
  Payment,
  StudentData,
  StudentIdentity,
  StudentNotification,
} from "@/lib/portal/types";

export const DEMO_LOGIN_EMAIL = "demo.student@alabatt-demo.test";
export const DEMO_LOGIN_PASSWORD = "CODLdemo2026!";
export const ADMIN_LOGIN_EMAIL = "admin@alabatt-demo.test";
export const ADMIN_LOGIN_PASSWORD = "CODLadmin2026!";
export const INSTRUCTOR_LOGIN_EMAIL = "instructor@alabatt-demo.test";
export const INSTRUCTOR_LOGIN_PASSWORD = "CODLinstructor2026!";

export const DEMO_IDENTITY: StudentIdentity = {
  id: "codl-demo-student",
  fullName: "Jane Doe",
  email: DEMO_LOGIN_EMAIL,
  studentId: "CODL-DEMO-001",
  role: "student",
};

export const ADMIN_IDENTITY: StudentIdentity = {
  id: "codl-demo-admin",
  fullName: "Amina Yakubu",
  email: ADMIN_LOGIN_EMAIL,
  studentId: "ADMIN-CODL-001",
  role: "admin",
};

export const INSTRUCTOR_IDENTITY: StudentIdentity = {
  id: "codl-demo-instructor",
  fullName: "Dr. Aisha Bello",
  email: INSTRUCTOR_LOGIN_EMAIL,
  studentId: "INST-CODL-001",
  role: "instructor",
};

export const DEMO_STUDENTS = [
  {
    id: "student-1001",
    studentId: "CODL-2024-1001",
    fullName: "Ada Okafor",
    email: "ada.okafor@alabatt-demo.test",
    phone: "+234 801 111 2233",
    programme: "BSc Computer Science",
    level: "200 Level",
    enrollmentStatus: "Active",
    dateOfEnrollment: "2025-01-12",
    registeredCourses: ["codl-101", "ict-104"],
  },
  {
    id: "student-1002",
    studentId: "CODL-2024-1002",
    fullName: "Kwame Boateng",
    email: "kwame.boateng@alabatt-demo.test",
    phone: "+234 802 334 7788",
    programme: "BSc Business Administration",
    level: "100 Level",
    enrollmentStatus: "Active",
    dateOfEnrollment: "2025-02-15",
    registeredCourses: ["edu-120"],
  },
  {
    id: "student-1003",
    studentId: "CODL-2024-1003",
    fullName: "Grace Nnaji",
    email: "grace.nnaji@alabatt-demo.test",
    phone: "+234 803 667 9981",
    programme: "Diploma in Education",
    level: "300 Level",
    enrollmentStatus: "Pending",
    dateOfEnrollment: "2025-03-03",
    registeredCourses: [],
  },
] as const;

export const DEMO_INSTRUCTORS = [
  {
    id: "instructor-2001",
    instructorId: "INST-201",
    fullName: "Dr. Aisha Bello",
    email: "aisha.bello@alabatt-demo.test",
    phone: "+234 804 556 1142",
    specialization: "Instructional Design",
    assignedCourses: ["codl-101", "edu-120"],
    status: "Active",
  },
  {
    id: "instructor-2002",
    instructorId: "INST-205",
    fullName: "Mr. Emmanuel Sani",
    email: "emmanuel.sani@alabatt-demo.test",
    phone: "+234 805 661 9910",
    specialization: "Digital Communication",
    assignedCourses: ["com-112"],
    status: "Active",
  },
  {
    id: "instructor-2003",
    instructorId: "INST-214",
    fullName: "Prof. Helen Okpala",
    email: "helen.okpala@alabatt-demo.test",
    phone: "+234 806 778 3481",
    specialization: "Technology in Education",
    assignedCourses: ["ict-104"],
    status: "On Leave",
  },
] as const;

export const DEMO_ADMIN_COURSES = [
  {
    id: "codl-101",
    code: "CODL 101",
    title: "Foundations of Open Learning",
    description: "Develop a strong understanding of distance learning frameworks and learner support systems.",
    programme: "Open and Distance Learning",
    instructorId: "instructor-2001",
    creditUnits: 2,
    registrationFee: 15000,
    status: "Open",
    modules: ["Orientation", "Learning Models", "Assessment Strategies"],
  },
  {
    id: "com-112",
    code: "COM 112",
    title: "Communication Skills",
    description: "Build confidence in communicating clearly in digital and in-person academic settings.",
    programme: "General Education",
    instructorId: "instructor-2002",
    creditUnits: 2,
    registrationFee: 12000,
    status: "Open",
    modules: ["Writing", "Presentation", "Listening"],
  },
  {
    id: "ict-104",
    code: "ICT 104",
    title: "Digital Study Skills",
    description: "Learn practical digital literacy skills for online learner productivity and collaboration.",
    programme: "Information Technology",
    instructorId: "instructor-2003",
    creditUnits: 3,
    registrationFee: 18000,
    status: "Open",
    modules: ["Research tools", "Digital organization", "Online collaboration"],
  },
  {
    id: "edu-120",
    code: "EDU 120",
    title: "Introduction to Learning",
    description: "Explore tutoring, student support and adult learning principles relevant to the distance education context.",
    programme: "Education",
    instructorId: "instructor-2001",
    creditUnits: 2,
    registrationFee: 15000,
    status: "Closed",
    modules: ["Teaching foundations", "Academic support", "Reflective practice"],
  },
] as const;

export const DEMO_VIDEO_SESSIONS = [
  {
    id: "session-001",
    title: "Orientation & LMS Setup",
    date: "2026-10-30",
    time: "09:00",
    host: "Learning Support",
    link: "https://meet.google.com/demo-orientation",
    status: "Scheduled",
  },
  {
    id: "session-002",
    title: "Research Methods Clinic",
    date: "2026-11-02",
    time: "15:30",
    host: "Dr. Aisha Bello",
    link: "https://zoom.us/j/demo-research-clinic",
    status: "Live",
  },
  {
    id: "session-003",
    title: "Digital Skills Lab",
    date: "2026-11-04",
    time: "11:00",
    host: "Prof. Helen Okpala",
    link: "https://meet.google.com/demo-digital-lab",
    status: "Scheduled",
  },
] as const;

export const DEMO_PAYMENT_ACTIVITY = [
  {
    id: "payment-admin-001",
    description: "Course registration fee",
    amount: 15000,
    date: "2026-09-12",
    reference: "CODL-REG-1041",
    status: "Successful",
  },
  {
    id: "payment-admin-002",
    description: "Learning resources fee",
    amount: 5000,
    date: "2026-09-09",
    reference: "CODL-RES-091",
    status: "Pending",
  },
  {
    id: "payment-admin-003",
    description: "Student support levy",
    amount: 3500,
    date: "2026-09-07",
    reference: "CODL-SUP-055",
    status: "Successful",
  },
] as const;

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
