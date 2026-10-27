export interface StudentIdentity {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
}

export interface DemoAccount extends StudentIdentity {
  passwordSalt?: string;
  passwordDigest?: string;
  createdAt: string;
}

export interface PortalSession {
  email: string;
  createdAt: string;
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
