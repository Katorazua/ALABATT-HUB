export type PortalRole = "student" | "admin" | "instructor";

export interface StudentIdentity {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  role?: PortalRole;
}

export interface DemoAccount extends StudentIdentity {
  passwordSalt?: string;
  passwordDigest?: string;
  createdAt: string;
}

export interface PortalSession {
  email: string;
  createdAt: string;
  role?: PortalRole;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  studentId: string;
  phone: string;
  address: string;
  programme: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  semester: string;
}

export type PaymentStatus = "Pending" | "Successful" | "Failed";

export interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
  reference: string;
  status: PaymentStatus;
}

export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  createdAt: string;
  read: boolean;
}

export interface StudentActivity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface StudentData {
  version: 1;
  profile: StudentProfile;
  registeredCourseIds: string[];
  payments: Payment[];
  notifications: StudentNotification[];
  activities: StudentActivity[];
}

export interface AdminStudentRecord {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  programme: string;
  level: string;
  enrollmentStatus: "Active" | "Inactive" | "Pending";
  dateOfEnrollment: string;
  registeredCourses: string[];
}

export interface AdminInstructorRecord {
  id: string;
  instructorId: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  assignedCourses: string[];
  status: "Active" | "On Leave" | "Inactive";
}

export interface AdminCourseRecord {
  id: string;
  code: string;
  title: string;
  description: string;
  programme: string;
  instructorId: string;
  creditUnits: number;
  registrationFee: number;
  status: "Open" | "Closed" | "Draft";
  modules: string[];
}

export interface AdminVideoSession {
  id: string;
  title: string;
  date: string;
  time: string;
  host: string;
  link: string;
  status: "Scheduled" | "Live" | "Completed";
}

export interface AdminDemoState {
  students: AdminStudentRecord[];
  instructors: AdminInstructorRecord[];
  courses: AdminCourseRecord[];
  videoSessions: AdminVideoSession[];
  paymentActivity: Payment[];
}
