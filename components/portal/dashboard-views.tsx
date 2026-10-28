"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";
import { PortalMessage, PrototypeBadge } from "@/components/portal/portal-ui";
import {
  COURSE_CATALOG,
} from "@/lib/portal/demo-data";
import type {
  Payment,
  StudentData,
  StudentNotification,
  StudentProfile,
} from "@/lib/portal/types";

export type PortalView =
  | "dashboard"
  | "profile"
  | "registration"
  | "courses"
  | "payments"
  | "resources"
  | "grades"
  | "attendance"
  | "timetable"
  | "exams"
  | "notifications"
  | "settings"
  | "complaint";

export const PORTAL_NAVIGATION: {
  group: string;
  items: { id: PortalView; label: string; icon: IconName }[];
}[] = [
  {
    group: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: "dashboard" }],
  },
  {
    group: "Learning",
    items: [
      { id: "registration", label: "Course Registration", icon: "edit" },
      { id: "courses", label: "My Courses", icon: "book" },
      { id: "grades", label: "Grades", icon: "grades" },
      { id: "attendance", label: "Attendance", icon: "check" },
      { id: "timetable", label: "Time Table", icon: "calendar" },
      { id: "resources", label: "Learning Resources", icon: "file" },
      { id: "exams", label: "Examination Info", icon: "calendar" },
    ],
  },
  {
    group: "Services",
    items: [
      { id: "payments", label: "Payments & Receipts", icon: "wallet" },
      { id: "notifications", label: "Notifications", icon: "notification" },
    ],
  },
  {
    group: "Account",
    items: [
      { id: "profile", label: "My Profile", icon: "profile" },
      { id: "settings", label: "Settings", icon: "settings" },
      { id: "complaint", label: "Help & Contact", icon: "support" },
    ],
  },
];

const resourceSamples = [
  {
    title: "Study planning guide",
    course: "General student resource",
    type: "Guide",
    description: "A sample guide to planning independent study time.",
  },
  {
    title: "Digital learning checklist",
    course: "General student resource",
    type: "Checklist",
    description: "A sample checklist for getting ready to learn online.",
  },
  {
    title: "Course reading notes",
    course: "CODL 101 · Demo course",
    type: "Reading",
    description: "An example resource listing for the student portal demo.",
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ViewHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="portal-view-heading">
      <div>
        <span className="portal-view-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function DashboardOverview({
  data,
  onNavigate,
}: {
  data: StudentData;
  onNavigate: (view: PortalView) => void;
}) {
  const registeredCourses = COURSE_CATALOG.filter((course) =>
    data.registeredCourseIds.includes(course.id),
  );
  const pendingPayments = data.payments.filter(
    (payment) => payment.status === "Pending",
  );
  const successfulPayments = data.payments.filter(
    (payment) => payment.status === "Successful",
  );
  const unreadCount = data.notifications.filter(
    (notification) => !notification.read,
  ).length;
  const firstName = data.profile.fullName.trim().split(/\s+/)[0] || "Student";

  return (
    <>
      <div className="portal-welcome-row">
        <div>
          <span className="portal-view-eyebrow">Student Portal</span>
          <h1>Good morning, {firstName}</h1>
          <p>Here’s a snapshot of your demo student account.</p>
        </div>
        <PrototypeBadge>DEMO ACCOUNT</PrototypeBadge>
      </div>

      <div className="portal-stat-grid">
        <article className="portal-stat-card">
          <span className="portal-stat-icon stat-icon-blue"><Icon name="book" /></span>
          <div><span>Registered courses</span><strong>{registeredCourses.length}</strong></div>
          <small>Sample course data</small>
        </article>
        <article className="portal-stat-card">
          <span className="portal-stat-icon stat-icon-orange"><Icon name="wallet" /></span>
          <div><span>Pending payments</span><strong>{pendingPayments.length}</strong></div>
          <small>Demo records only</small>
        </article>
        <article className="portal-stat-card">
          <span className="portal-stat-icon stat-icon-green"><Icon name="receipt" /></span>
          <div><span>Completed simulations</span><strong>{successfulPayments.length}</strong></div>
          <small>Not real transactions</small>
        </article>
        <article className="portal-stat-card">
          <span className="portal-stat-icon stat-icon-purple"><Icon name="notification" /></span>
          <div><span>Unread updates</span><strong>{unreadCount}</strong></div>
          <small>Sample notifications</small>
        </article>
      </div>

      <div className="portal-overview-grid">
        <div className="portal-overview-main">
          <section aria-labelledby="overview-courses-title" className="portal-panel">
            <div className="portal-panel-heading">
              <div>
                <h2 id="overview-courses-title">My Courses</h2>
                <p>Your current sample course list</p>
              </div>
              <button className="portal-inline-action" onClick={() => onNavigate("courses")} type="button">
                View all <Icon name="arrow-right" />
              </button>
            </div>
            {registeredCourses.length === 0 ? (
              <div className="portal-empty-state">
                <span><Icon name="book" /></span>
                <strong>No courses in your demo list yet</strong>
                <p>Explore the sample course catalogue to add a course.</p>
                <button className="portal-small-button" onClick={() => onNavigate("registration")} type="button">
                  Browse sample courses
                </button>
              </div>
            ) : (
              <div className="overview-course-list">
                {registeredCourses.slice(0, 4).map((course) => (
                  <div className="overview-course-row" key={course.id}>
                    <span className="course-code-mark">{course.code.slice(0, 3)}</span>
                    <span className="overview-course-title">
                      <strong>{course.title}</strong>
                      <small>{course.code} · {course.creditUnits} credit units</small>
                    </span>
                    <span className="course-semester">{course.semester}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="portal-sample-caption">All course information is sample data.</div>
          </section>

          <section aria-labelledby="overview-activity-title" className="portal-panel">
            <div className="portal-panel-heading">
              <div>
                <h2 id="overview-activity-title">Recent Activity</h2>
                <p>Changes saved in this browser</p>
              </div>
              <span className="panel-heading-icon"><Icon name="clock" /></span>
            </div>
            {data.activities.length === 0 ? (
              <div className="activity-empty">
                <span className="activity-line-icon"><Icon name="spark" /></span>
                <p>Updates you make in this demo will appear here.</p>
              </div>
            ) : (
              <div className="activity-list">
                {data.activities.slice(0, 4).map((activity) => (
                  <div className="activity-row" key={activity.id}>
                    <span className="activity-line-icon"><Icon name="check" /></span>
                    <div><strong>{activity.title}</strong><p>{activity.description}</p></div>
                    <time dateTime={activity.createdAt}>{formatDate(activity.createdAt)}</time>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="portal-overview-aside">
          <section aria-labelledby="academic-calendar-title" className="portal-panel academic-calendar-panel">
            <div className="portal-panel-heading">
              <div>
                <h2 id="academic-calendar-title">Academic Calendar</h2>
                <p>Official dates and deadlines</p>
              </div>
              <span className="calendar-mark"><Icon name="calendar" /></span>
            </div>
            <div className="calendar-placeholder">
              <span className="calendar-placeholder-icon"><Icon name="calendar" /></span>
              <strong>University dates will appear here</strong>
              <p>No official academic calendar has been connected to this demo.</p>
            </div>
          </section>

          <section aria-labelledby="overview-updates-title" className="portal-panel updates-panel">
            <div className="portal-panel-heading">
              <div>
                <h2 id="overview-updates-title">Announcements</h2>
                <p>Sample academic updates</p>
              </div>
              <button
                aria-label={`${unreadCount} unread notifications; view all`}
                className="portal-inline-action"
                onClick={() => onNavigate("notifications")}
                type="button"
              >
                View all <Icon name="arrow-right" />
              </button>
            </div>
            <div className="overview-notifications">
              {data.notifications.slice(0, 3).map((notification) => (
                <div className="overview-notification" key={notification.id}>
                  <span className={`announcement-initial${notification.read ? "" : " has-unread"}`}>
                    {notification.title.charAt(0)}
                  </span>
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <time dateTime={notification.createdAt}>{formatDate(notification.createdAt)}</time>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="student-summary-title" className="portal-panel profile-summary-panel">
            <div className="portal-panel-heading">
              <div>
                <h2 id="student-summary-title">Student Profile</h2>
                <p>Demo account details</p>
              </div>
            </div>
            <dl className="profile-summary-list">
              <div><dt>Student ID</dt><dd>{data.profile.studentId}</dd></div>
              <div><dt>Programme</dt><dd>{data.profile.programme}</dd></div>
              <div><dt>Current term</dt><dd>Sample semester</dd></div>
            </dl>
            <button className="portal-inline-action" onClick={() => onNavigate("profile")} type="button">
              View profile <Icon name="arrow-right" />
            </button>
          </section>
        </aside>
      </div>
    </>
  );
}

export function ProfileView({
  profile,
  onSave,
}: {
  profile: StudentProfile;
  onSave: (profile: StudentProfile) => void;
}) {
  const [form, setForm] = useState(profile);
  const [formError, setFormError] = useState("");

  return (
    <section className="portal-panel portal-form-panel">
      <ViewHeader
        description="Update the editable details saved for this demo account on this browser."
        eyebrow="ACCOUNT"
        title="My Profile"
      />
      <PortalMessage kind="info">
        Use sample information only. Profile changes are stored locally in this browser.
      </PortalMessage>
      <form
        className="portal-profile-form"
        onSubmit={(event) => {
          event.preventDefault();
          const updatedProfile = {
            ...form,
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
          };
          if (!updatedProfile.fullName) {
            setFormError("Enter a name for this demo profile.");
            return;
          }
          setFormError("");
          setForm(updatedProfile);
          onSave(updatedProfile);
        }}
      >
        {formError && <PortalMessage kind="error">{formError}</PortalMessage>}
        <label>
          Full name
          <input
            autoComplete="name"
            maxLength={100}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            required
            value={form.fullName}
          />
        </label>
        <label>
          Email address <span className="field-note">Account identifier</span>
          <input readOnly value={form.email} />
        </label>
        <label>
          Student ID <span className="field-note">Demo identifier</span>
          <input readOnly value={form.studentId} />
        </label>
        <label>
          Phone number <span className="field-note">Optional demo value</span>
          <input
            autoComplete="tel"
            maxLength={30}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="Not provided"
            type="tel"
            value={form.phone}
          />
        </label>
        <label className="profile-address-field">
          Address <span className="field-note">Optional demo value</span>
          <textarea
            autoComplete="street-address"
            maxLength={240}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
            placeholder="Not provided"
            rows={3}
            value={form.address}
          />
        </label>
        <div className="profile-readonly-note">
          <Icon name="info" />
          <span>Student ID, account role, and verified payment records are protected from editing.</span>
        </div>
        <button className="button button-primary portal-form-submit" type="submit">
          Save profile <Icon name="check" />
        </button>
      </form>
    </section>
  );
}

export function CourseRegistrationView({
  data,
  onAdd,
}: {
  data: StudentData;
  onAdd: (courseId: string) => void;
}) {
  const availableCourses = COURSE_CATALOG.filter(
    (course) => !data.registeredCourseIds.includes(course.id),
  );

  return (
    <>
      <ViewHeader
        description="Explore the sample catalogue and add courses to your local demo registration list."
        eyebrow="LEARNING"
        title="Course Registration"
        action={<PrototypeBadge>DEMO CATALOGUE</PrototypeBadge>}
      />
      <PortalMessage kind="info">
        Course availability, codes, credit units, and registration outcomes below are sample data only.
      </PortalMessage>
      {availableCourses.length === 0 ? (
        <div className="portal-panel portal-empty-state course-catalog-empty">
          <span><Icon name="check" /></span>
          <strong>You’ve added every sample course</strong>
          <p>Remove a course from My Courses to add it again.</p>
        </div>
      ) : (
        <div className="portal-course-grid">
          {availableCourses.map((course) => (
            <article className="portal-panel available-course-card" key={course.id}>
              <div className="course-card-header">
                <span className="course-code-mark">{course.code.slice(0, 3)}</span>
                <PrototypeBadge>SAMPLE</PrototypeBadge>
              </div>
              <span className="course-card-code">{course.code}</span>
              <h2>{course.title}</h2>
              <div className="course-card-meta">
                <span>{course.creditUnits} credit units</span>
                <span>{course.semester}</span>
              </div>
              <button
                className="button button-primary portal-small-button"
                onClick={() => onAdd(course.id)}
                type="button"
              >
                Add to demo list <Icon name="arrow-right" />
              </button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export function CoursesView({
  data,
  onRemove,
}: {
  data: StudentData;
  onRemove: (courseId: string) => void;
}) {
  const registeredCourses = COURSE_CATALOG.filter((course) =>
    data.registeredCourseIds.includes(course.id),
  );

  return (
    <>
      <ViewHeader
        description="Courses currently saved in this browser's demo registration list."
        eyebrow="LEARNING"
        title="My Courses"
        action={<PrototypeBadge>{registeredCourses.length} SAMPLE COURSES</PrototypeBadge>}
      />
      <PortalMessage kind="info">
        This list is a frontend demonstration and does not represent official enrolment.
      </PortalMessage>
      {registeredCourses.length === 0 ? (
        <div className="portal-panel portal-empty-state course-catalog-empty">
          <span><Icon name="book" /></span>
          <strong>No courses are registered in this demo</strong>
          <p>Sample courses you add will appear here.</p>
        </div>
      ) : (
        <div className="portal-registered-list">
          {registeredCourses.map((course) => (
            <article className="portal-panel registered-course-card" key={course.id}>
              <span className="course-code-mark"><Icon name="book" /></span>
              <div className="registered-course-info">
                <span className="course-card-code">{course.code} · {course.creditUnits} units</span>
                <h2>{course.title}</h2>
                <p>{course.semester}</p>
              </div>
              <PrototypeBadge>DEMO</PrototypeBadge>
              <button
                aria-label={`Remove ${course.code} from demo course list`}
                className="portal-icon-button danger-icon-button"
                onClick={() => {
                  if (window.confirm(`Remove ${course.code} from your demo course list?`)) {
                    onRemove(course.id);
                  }
                }}
                title="Remove course from demo list"
                type="button"
              >
                <Icon name="trash" />
              </button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export function PaymentsView({
  payments,
  onSimulate,
}: {
  payments: Payment[];
  onSimulate: (paymentId: string) => void;
}) {
  const [confirmPayment, setConfirmPayment] = useState<Payment | null>(null);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  return (
    <>
      <ViewHeader
        description="Review sample records or run a local-only payment simulation."
        eyebrow="STUDENT SERVICES"
        title="Payments & Receipts"
        action={<PrototypeBadge>SIMULATED ONLY</PrototypeBadge>}
      />
      <PortalMessage kind="info">
        No money is transferred. This demo does not connect to a payment provider or verify university fees.
      </PortalMessage>
      <section aria-label="Sample payment records" className="portal-panel payments-panel">
        <div className="portal-panel-heading">
          <div><h2>Payment records</h2><p>All entries are fictional sample records.</p></div>
          <span className="panel-heading-icon"><Icon name="receipt" /></span>
        </div>
        {payments.length === 0 ? (
          <div className="portal-empty-state">
            <span><Icon name="wallet" /></span>
            <strong>No sample payments</strong>
            <p>Sample payment records will appear here for the demo account.</p>
          </div>
        ) : (
          <div className="portal-table-scroll">
            <table className="portal-table">
              <thead>
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Date</th>
                  <th scope="col">Reference</th>
                  <th scope="col">Status</th>
                  <th scope="col"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td data-label="Description">{payment.description}</td>
                    <td data-label="Amount">{formatCurrency(payment.amount)}</td>
                    <td data-label="Date">{formatDate(payment.date)}</td>
                    <td className="reference-cell" data-label="Reference">{payment.reference}</td>
                    <td data-label="Status">
                      <span className={`payment-status status-${payment.status.toLowerCase()}`}>
                        <span />{payment.status}
                      </span>
                    </td>
                    <td className="payment-action-cell" data-label="Action">
                      {payment.status === "Successful" ? (
                        <button
                          className="portal-small-button portal-receipt-button"
                          onClick={() => setReceiptPayment(payment)}
                          type="button"
                        >
                          <Icon name="receipt" /> View receipt
                        </button>
                      ) : (
                        <button
                          className="portal-small-button portal-receipt-button"
                          onClick={() => setConfirmPayment(payment)}
                          type="button"
                        >
                          Simulate payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="portal-sample-caption">Successful demo records can be printed as clearly labelled sample receipts.</div>
      </section>

      {confirmPayment && (
        <div
          aria-labelledby="payment-confirm-title"
          aria-modal="true"
          className="portal-dialog-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setConfirmPayment(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setConfirmPayment(null);
          }}
          role="dialog"
          tabIndex={-1}
        >
          <div className="portal-dialog">
            <span className="dialog-icon"><Icon name="wallet" /></span>
            <h2 id="payment-confirm-title">Confirm demo payment</h2>
            <p>
              This will mark <strong>{confirmPayment.description}</strong> as
              successful in the local demo only. No money will be charged or transferred.
            </p>
            <div className="dialog-amount">{formatCurrency(confirmPayment.amount)}</div>
            <div className="dialog-actions">
              <button className="button button-secondary" onClick={() => setConfirmPayment(null)} type="button">
                Cancel
              </button>
              <button
                className="button button-primary"
                onClick={() => {
                  onSimulate(confirmPayment.id);
                  setConfirmPayment(null);
                }}
                type="button"
              >
                Confirm simulation
              </button>
            </div>
          </div>
        </div>
      )}
      {receiptPayment && (
        <div
          aria-labelledby="sample-receipt-title"
          aria-modal="true"
          className="portal-dialog-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setReceiptPayment(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setReceiptPayment(null);
          }}
          role="dialog"
          tabIndex={-1}
        >
          <div className="portal-dialog receipt-dialog">
            <div className="portal-receipt-print">
              <span className="receipt-mark"><Icon name="cap" /></span>
              <PrototypeBadge>SIMULATED · NOT PROOF OF PAYMENT</PrototypeBadge>
              <h2 id="sample-receipt-title">Demo payment receipt</h2>
              <p>This sample receipt does not confirm an actual university transaction.</p>
              <dl className="receipt-details">
                <div><dt>Description</dt><dd>{receiptPayment.description}</dd></div>
                <div><dt>Amount</dt><dd>{formatCurrency(receiptPayment.amount)}</dd></div>
                <div><dt>Date</dt><dd>{formatDate(receiptPayment.date)}</dd></div>
                <div><dt>Sample reference</dt><dd>{receiptPayment.reference}</dd></div>
                <div><dt>Status</dt><dd>Successful · simulation only</dd></div>
              </dl>
            </div>
            <div className="dialog-actions receipt-dialog-actions">
              <button className="button button-secondary" onClick={() => setReceiptPayment(null)} type="button">
                Close
              </button>
              <button className="button button-primary" onClick={() => window.print()} type="button">
                <Icon name="receipt" /> Print sample receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ResourcesView({
  onUnavailable,
}: {
  onUnavailable: (title: string) => void;
}) {
  return (
    <>
      <ViewHeader
        description="A preview of how learning materials could be listed for CODL students."
        eyebrow="LEARNING"
        title="Learning Resources"
        action={<PrototypeBadge>SAMPLE LISTINGS</PrototypeBadge>}
      />
      <PortalMessage kind="info">
        No official university files or learning links are connected to this prototype.
      </PortalMessage>
      <div className="portal-resource-grid">
        {resourceSamples.map((resource) => (
          <article className="portal-panel resource-card" key={resource.title}>
            <span className="resource-icon"><Icon name="file" /></span>
            <span className="resource-type">{resource.type} · Sample</span>
            <h2>{resource.title}</h2>
            <span className="resource-course">{resource.course}</span>
            <p>{resource.description}</p>
            <button
              className="portal-inline-action"
              onClick={() => onUnavailable(resource.title)}
              type="button"
            >
              Open resource <Icon name="arrow-up-right" />
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

export function NotificationsView({
  notifications,
  onMarkRead,
}: {
  notifications: StudentNotification[];
  onMarkRead: (notificationId: string) => void;
}) {
  return (
    <>
      <ViewHeader
        description="Read and manage the example updates stored for your demo account."
        eyebrow="STUDENT SERVICES"
        title="Notifications"
        action={<PrototypeBadge>SAMPLE UPDATES</PrototypeBadge>}
      />
      <PortalMessage kind="info">
        These examples are not official university announcements.
      </PortalMessage>
      <section aria-label="Sample notifications" className="portal-panel notification-list-panel">
        {notifications.length === 0 ? (
          <div className="portal-empty-state">
            <span><Icon name="notification" /></span>
            <strong>You’re all caught up</strong>
            <p>There are no demo notifications to display.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <article
              className={`portal-notification-row${notification.read ? " is-read" : ""}`}
              key={notification.id}
            >
              <span className="notification-mark"><Icon name={notification.read ? "check" : "notification"} /></span>
              <div className="notification-copy">
                <div className="notification-title-row">
                  <h2>{notification.title}</h2>
                  {!notification.read && <span className="unread-label">UNREAD</span>}
                </div>
                <p>{notification.message}</p>
                <span className="notification-meta">{notification.category} · {formatDate(notification.createdAt)}</span>
              </div>
              {!notification.read && (
                <button
                  className="portal-small-button mark-read-button"
                  onClick={() => onMarkRead(notification.id)}
                  type="button"
                >
                  Mark as read
                </button>
              )}
            </article>
          ))
        )}
      </section>
    </>
  );
}

export function SettingsView({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <>
      <ViewHeader
        description="Manage local prototype preferences and saved demo information."
        eyebrow="ACCOUNT"
        title="Settings"
      />
      <section className="portal-panel settings-panel">
        <div className="settings-row">
          <div>
            <h2>Browser demo data</h2>
            <p>Sample profile edits, course selections, and payment simulations are saved in this browser only.</p>
          </div>
          <PrototypeBadge>LOCAL ONLY</PrototypeBadge>
        </div>
        <div className="settings-warning">
          <Icon name="info" />
          <p>
            Do not enter real passwords, payment information, or private student
            details. This prototype does not provide production security.
          </p>
        </div>
        <button
          className="button button-danger"
          onClick={() => {
            if (window.confirm("Reset this demo account's profile, courses, payments, and notifications?")) {
              onReset();
            }
          }}
          type="button"
        >
          <Icon name="trash" /> Reset demo data
        </button>
      </section>
    </>
  );
}

export function PlaceholderView({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="portal-panel portal-coming-soon">
      <span className="coming-soon-icon"><Icon name="spark" /></span>
      <PrototypeBadge>COMING SOON</PrototypeBadge>
      <h1>{title}</h1>
      <p>{description}</p>
      <PortalMessage kind="info">
        This prototype does not contain official university information for this section.
      </PortalMessage>
      <Link className="portal-inline-action" href="/#contact">
        CODL contact information <Icon name="arrow-right" />
      </Link>
    </section>
  );
}
