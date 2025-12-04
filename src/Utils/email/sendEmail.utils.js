import nodemailer from "nodemailer";

export async function sendEmail({
  to = "",
  subject = "sara7a app",
  text = "",
  html = "",
  cc = "",
  bcc = "",
  attachments = [],
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Sara7a Application 🤖" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    html,
    cc,
    bcc,
    attachments,
  });
}

export const emailSubject = {
  confirmEmail: "Confirm your email",
  resetPassword: "Reset your password",
  welcome: "Welcome to Sara7a",
};
