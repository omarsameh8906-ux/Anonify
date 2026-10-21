
import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD, APPLICATION_NAME } from "../../../config.js";
import { BadException } from "../../exceptions/error.exception.js";

export const UserEmailKey = ({email , subject})=>{
  return `User::${email}::${subject}::OTP`
}

export const UserEmailTrialsKey = ({email , subject})=>{
  return `${UserEmailKey({email , subject})}::Trials`
}

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});

export const sendEmail = async ({
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments=[]
})=>{
try {
    if(!to?.length && !cc?.length && !bcc?.length){
        throw BadException("Missing Email Recipients")
    }
      if(!text?.length && !html?.length && !attachments?.length){
        throw BadException("Missing Email Content")
    }
  const info = await transporter.sendMail({
    from: `"${APPLICATION_NAME}" <${APP_EMAIL}>`, 
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments
  });

 
} catch (err) {
 
  console.error("Error while sending mail:", err.code, err.responseCode, err.message)
  throw err

}
}