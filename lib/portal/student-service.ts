import {
  COURSE_CATALOG,
  createInitialStudentData,
} from "@/lib/portal/demo-data";
import {
  readStudentData,
  removeStudentData,
  writeStudentData,
} from "@/lib/portal/storage";
import type {
  Payment,
  StudentActivity,
  StudentData,
  StudentIdentity,
  StudentNotification,
  StudentProfile,
} from "@/lib/portal/types";

function withActivity(
  data: StudentData,
  title: string,
  description: string,
): StudentActivity[] {
  const activity: StudentActivity = {
    id: window.crypto.randomUUID(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  return [activity, ...data.activities].slice(0, 6);
}

export function loadStudentData(identity: StudentIdentity): StudentData {
  const saved = readStudentData(identity.email);
  if (saved) return saved;

  const initial = createInitialStudentData(identity);
  writeStudentData(identity.email, initial);
  return initial;
}

export function saveProfile(
  data: StudentData,
  profile: StudentProfile,
): StudentData {
  return {
    ...data,
    profile: {
      ...data.profile,
      fullName: profile.fullName.trim(),
      phone: profile.phone.trim(),
      address: profile.address.trim(),
    },
    activities: withActivity(data, "Profile updated", "Your demo profile was saved on this browser."),
  };
}

export function addCourse(
  data: StudentData,
  courseId: string,
): StudentData {
  const course = COURSE_CATALOG.find((item) => item.id === courseId);
  if (!course) throw new Error("That sample course is not available.");
  if (data.registeredCourseIds.includes(courseId)) {
    throw new Error("This sample course is already in your registration list.");
  }

  return {
    ...data,
    registeredCourseIds: [...data.registeredCourseIds, courseId],
    activities: withActivity(
      data,
      "Sample course added",
      `${course.code} was added to your demo course list.`,
    ),
  };
}

export function removeCourse(
  data: StudentData,
  courseId: string,
): StudentData {
  const course = COURSE_CATALOG.find((item) => item.id === courseId);
  if (!course || !data.registeredCourseIds.includes(courseId)) {
    throw new Error("That sample course is not in your registration list.");
  }

  return {
    ...data,
    registeredCourseIds: data.registeredCourseIds.filter((id) => id !== courseId),
    activities: withActivity(
      data,
      "Sample course removed",
      `${course.code} was removed from your demo course list.`,
    ),
  };
}

export function simulatePayment(
  data: StudentData,
  paymentId: string,
): { data: StudentData; payment: Payment } {
  const payment = data.payments.find((item) => item.id === paymentId);
  if (!payment || payment.status === "Successful") {
    throw new Error("This sample payment cannot be simulated again.");
  }

  const updatedPayment: Payment = {
    ...payment,
    status: "Successful",
    date: new Date().toISOString(),
    reference: `SIM-${window.crypto.randomUUID().slice(0, 8).toUpperCase()}`,
  };
  const updatedData: StudentData = {
    ...data,
    payments: data.payments.map((item) =>
      item.id === paymentId ? updatedPayment : item,
    ),
    activities: withActivity(
      data,
      "Payment simulation completed",
      `${payment.description} was marked successful in this demo only.`,
    ),
  };

  return { data: updatedData, payment: updatedPayment };
}

export function markNotificationRead(
  data: StudentData,
  notificationId: string,
): StudentData {
  const notification = data.notifications.find(
    (item) => item.id === notificationId,
  );
  if (!notification) throw new Error("That notification could not be found.");
  if (notification.read) return data;

  const updatedNotifications: StudentNotification[] = data.notifications.map(
    (item) =>
      item.id === notificationId ? { ...item, read: true } : item,
  );

  return {
    ...data,
    notifications: updatedNotifications,
    activities: withActivity(
      data,
      "Notification read",
      notification.title,
    ),
  };
}

export function persistStudentData(
  identity: StudentIdentity,
  data: StudentData,
): void {
  writeStudentData(identity.email, data);
}

export function resetStudentData(identity: StudentIdentity): StudentData {
  removeStudentData(identity.email);
  const initial = createInitialStudentData(identity);
  writeStudentData(identity.email, initial);
  return initial;
}
