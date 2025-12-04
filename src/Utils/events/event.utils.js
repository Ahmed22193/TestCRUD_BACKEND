import { EventEmitter } from "node:events";
import { emailSubject } from "../email/sendEmail.utils.js";
import { sendEmail } from "../email/sendEmail.utils.js";
import { confirmEmailTemplate } from "../email/generateHTML.js";
export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubject.confirmEmail,
    html: confirmEmailTemplate(
      data.firstName,
      emailSubject.confirmEmail,
      data.otp
    ),
  });
});
emailEvent.on("forgetPassword", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubject.resetPassword,
    html: confirmEmailTemplate(
      data.firstName,
      emailSubject.resetPassword,
      data.otp
    ),
  });
});
