"use server";

import nodemailer from "nodemailer";

export async function sendEmail(dest_email: string[], subject: string, html: string, text: string) {
    if (process.env.DEV_MODE) console.log("Send email");

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: dest_email,
        subject,
        html,
        text,
    };

    await transporter.sendMail(mailOptions);

    if (process.env.DEV_MODE) console.log("Email sent");
}

interface FormProps {
    email: string;
    subject: string;
    message: string;
}

function escapeHtml(unsafe: string | undefined): string | undefined {
    return unsafe?.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

export async function sendForm({email, subject, message }: FormProps, emails: string[]) {
    if (process.env.DEV_MODE) console.log("sending form");

    const date = new Date();
    const formattedDate = `${date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    })} ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;

    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const safeSubject = escapeHtml(subject) ;

    const html = `        
    <!DOCTYPE html>
    <html lang="en">
        <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Contact | ${safeSubject}</title>
                <style>
                    body {
                        padding: 10px;
                    }
                    table{
                        width: 100%;
                    }
        
                    tr { 
                        width: 100%;
                    }
        
                        th, td {
                            padding: 8px;
                            
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }
        
                        th {
                            background-color: #f2f2f2;
                        }
        
                    </style>
            </head>
            <body>
                <div class="infos">
                    <H1>${safeSubject}</H1>
                    <table>
                        <tr>
                            <td>Mail</td>
                            <td>${safeEmail}</td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>${formattedDate}</td>
                        </tr>
        
                    </table>
                </div>
                <H2>Message</H2>
                <div class="text">${safeMessage}</div>
                </div>
            </body>
        </html>`;

    const text = `
Mail:\t${safeEmail}
Date:\t${formattedDate}

Message

${message}
    `;

    const email_subject = `[Formulaire contact][] ${subject}`;

    await sendEmail(emails, email_subject, html, text);

    if (process.env.DEV_MODE) console.log("form sent");
}
