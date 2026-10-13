import { EmailSubjectEnum } from "../../enum/email.enum.js";

export const Templates = {
    [EmailSubjectEnum.CONFIRM_EMAIL]:(data)=>{
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${data.title}</title>
        </head>
        <body style="margin:0; padding:20px; background-color:#f3f4f6; font-family:Arial,sans-serif;">

            <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden;">

                <div style="background-color:#4f46e5; padding:25px; text-align:center; color:#ffffff;">
                    <h1>Anonify</h1>
                    <h2>${data.title}</h2>
                </div>

                <div style="padding:30px; text-align:center;">
                    <p style="color:#6b7280; font-size:16px;">
                        Your verification code is:
                    </p>

                    <h1 style="color:#4f46e5; background-color:#eef2ff; padding:20px; letter-spacing:8px;">
                        ${data.code}
                    </h1>

                    <p style="color:#6b7280;">
                        Please do not share this code with anyone.
                    </p>
                </div>

                <div style="padding:20px; text-align:center; background-color:#f9fafb;">
                    <a href="https://www.facebook.com/" style="color:#1877f2; margin:8px;">Facebook</a>
                    <a href="https://www.instagram.com/" style="color:#c13584; margin:8px;">Instagram</a>
                    <a href="https://www.linkedin.com/" style="color:#0a66c2; margin:8px;">LinkedIn</a>
                    <a href="https://github.com/" style="color:#24292f; margin:8px;">GitHub</a>
                </div>

                <div style="padding:15px; text-align:center; background-color:#4f46e5; color:#ffffff;">
                    <p>&copy; ${new Date().getFullYear()} Anonify. All rights reserved.</p>
                </div>

            </div>

        </body>
        </html>`;
    
    },


 [EmailSubjectEnum.FORGET_PASSWORD]:(data)=>{
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${data.title}</title>
        </head>
        <body style="margin:0; padding:20px; background-color:#f3f4f6; font-family:Arial,sans-serif;">

            <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden;">

                <div style="background-color:#4f46e5; padding:25px; text-align:center; color:#ffffff;">
                    <h1>Anonify</h1>
                    <h2>${data.title}</h2>
                </div>

                <div style="padding:30px; text-align:center;">
                    <p style="color:#6b7280; font-size:16px;">
                        Your verification code is:
                    </p>

                    <h1 style="color:#4f46e5; background-color:#eef2ff; padding:20px; letter-spacing:8px;">
                        ${data.code}
                    </h1>

                    <p style="color:#6b7280;">
                        Please do not share this code with anyone.
                    </p>
                </div>

                <div style="padding:20px; text-align:center; background-color:#f9fafb;">
                    <a href="https://www.facebook.com/" style="color:#1877f2; margin:8px;">Facebook</a>
                    <a href="https://www.instagram.com/" style="color:#c13584; margin:8px;">Instagram</a>
                    <a href="https://www.linkedin.com/" style="color:#0a66c2; margin:8px;">LinkedIn</a>
                    <a href="https://github.com/" style="color:#24292f; margin:8px;">GitHub</a>
                </div>

                <div style="padding:15px; text-align:center; background-color:#4f46e5; color:#ffffff;">
                    <p>&copy; ${new Date().getFullYear()} Anonify. All rights reserved.</p>
                </div>

            </div>

        </body>
        </html>`;
    }
}


export const verifyEmailTemplate = (data) => {
    return Templates[data.subject](data)
};
