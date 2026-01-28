import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST || "smtp.zoho.com";
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const from = process.env.SMTP_FROM || user;
  const fromName = process.env.SMTP_FROM_NAME || "";
  if (!user || !pass || !from) {
    return null;
  }
  return {
    host,
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    user,
    pass,
    from,
    fromName
  };
};

const formatFrom = (from, fromName) => {
  if (!fromName) return from;
  return `${fromName} <${from}>`;
};

const buildStudentEmail = (name, courses) => {
  const list = courses.map((title) => `- ${title}`).join("\n");
  return {
    subject: "Enrollment confirmed",
    text: `Hello ${name},\n\nYour payment was confirmed and your enrollment is active for:\n${list}\n\nIf you have questions, contact support.\n`
  };
};

const buildNotificationEmail = (label, studentName, studentEmail, courses) => {
  const list = courses.map((title) => `- ${title}`).join("\n");
  return {
    subject: "New enrollment",
    text: `Hello ${label},\n\nA new enrollment was created.\n\nStudent: ${studentName} (${studentEmail})\nCourses:\n${list}\n`
  };
};

export const sendEnrollmentEmails = internalAction({
  args: {
    orderId: v.string(),
    studentEmail: v.optional(v.string()),
    studentName: v.optional(v.string()),
    studentUserId: v.string(),
    courseTitles: v.array(v.string()),
    teacherNotifications: v.array(
      v.object({
        email: v.string(),
        courses: v.array(v.string())
      })
    ),
    adminEmails: v.array(v.string())
  },
  handler: async (_ctx, args) => {
    const smtp = getSmtpConfig();
    if (!smtp) {
      console.warn("email_notifications_skipped", {
        orderId: args.orderId,
        reason: "smtp_not_configured"
      });
      return;
    }

    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass
      }
    });

    const from = formatFrom(smtp.from, smtp.fromName);
    const studentName = (args.studentName || "").trim() || "Student";
    const studentEmail = (args.studentEmail || "").trim();

    try {
      if (studentEmail) {
        const message = buildStudentEmail(studentName, args.courseTitles);
        await transport.sendMail({
          from,
          to: studentEmail,
          subject: message.subject,
          text: message.text
        });
      }

      const adminMessage = buildNotificationEmail(
        "Admin",
        studentName,
        studentEmail || args.studentUserId,
        args.courseTitles
      );
      for (const email of args.adminEmails) {
        if (!email) continue;
        await transport.sendMail({
          from,
          to: email,
          subject: adminMessage.subject,
          text: adminMessage.text
        });
      }

      for (const teacher of args.teacherNotifications) {
        if (!teacher.email) continue;
        const teacherMessage = buildNotificationEmail(
          "Teacher",
          studentName,
          studentEmail || args.studentUserId,
          teacher.courses
        );
        await transport.sendMail({
          from,
          to: teacher.email,
          subject: teacherMessage.subject,
          text: teacherMessage.text
        });
      }
    } catch (error) {
      console.warn("email_notifications_failed", {
        orderId: args.orderId
      });
    }
  }
});
